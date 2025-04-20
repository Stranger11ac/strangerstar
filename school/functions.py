from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.contrib.auth.models import User, Group
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.db import IntegrityError
from django.utils import timezone
from django.db import transaction
from .models import UserProfile
from functools import wraps
import csv
import io

def group_required(group_name):
    """
    Decorador para restringir el acceso a usuarios que pertenezcan a un grupo específico.
    """
    def decorator(view_func):
        @wraps(view_func)
        @login_required
        def _wrapped_view(request, *args, **kwargs):
            if request.user.groups.filter(name=group_name).exists() or request.user.is_superuser:
                return view_func(request, *args, **kwargs)
            return redirect('singout')
        return _wrapped_view
    return decorator

def create_newuser(first_name, last_name, username, password1, email=None, password2=None, is_staff=False, is_active=False, group=None, insignia=None, num_list=None, uid=None):
    try:
        allowed_groups = ['admin', 'professor', 'student']
        group = group if group in allowed_groups else 'student'

        if User.objects.filter(username=username).exists():
            return {'datastatus': False, 'message': 'El nombre de usuario ya está en uso. Prueba con otro.'}

        if email and User.objects.filter(email=email).exists():
            return {'datastatus': False, 'message': 'El correo electrónico ya está registrado. Usa otro o inicia sesión.'}

        is_superuser = (group == 'admin')
        if is_superuser:
            is_staff = True

        # Crear usuario
        new_user = User.objects.create_user(
            first_name = first_name.strip().lower(),
            last_name = last_name.strip().lower(),
            username = username.strip(),
            email = email.strip(),
            password = password1,
            is_staff = is_staff,
            is_active = is_active,
            is_superuser = is_superuser
        )
        new_user.save()

        # Actualizar UserProfile con los nuevos campos
        user_profile = UserProfile.objects.get(user=new_user)
        user_profile.insignia = insignia
        user_profile.num_list = num_list
        user_profile.uid = uid
        user_profile.save()

        if not Group.objects.filter(name=group).exists():
            group_obj = Group.objects.create(name=group)
        else:
            group_obj = Group.objects.get(name=group)

        new_user.groups.add(group_obj)

        aviso = ''
        if password2 is not None:
            aviso = '<br>Tu cuenta está <u>Desactivada</u> 😯😬'
        return {'datastatus': True, 'message': f'Usuario creado exitosamente 🥳🎈 {aviso}'}
    
    except IntegrityError:
            return {'datastatus': False, 'message': 'Error de integridad en la base de datos. Posible duplicado de datos.'}

    except Exception as e:
        return {'datastatus': False, 'message': f'Ocurrió un error inesperado: {str(e)}'}

def create_csv(filename, header, rows):
    response = HttpResponse(content_type='text/csv; charset=utf-8')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    response.write('\ufeff'.encode('utf8'))

    writer = csv.writer(response)
    writer.writerow(header)
    for row in rows:
        writer.writerow(row)
    return response

def str_to_bool(value):
    """Convierte un texto en booleano inteligentemente."""
    if isinstance(value, str):
        return value.strip().lower() in ('true', '1', 'yes', 'si', 'activo')
    return bool(value)

@transaction.atomic
def import_from_csv(file_path, model_configs):
    with open(file_path, mode='r', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)  # Ignorar encabezado

        for row_number, row in enumerate(reader, start=2):
            instances = {}

            try:
                col_pointer = 0
                for config in model_configs:
                    model = config['model']
                    fields = config['fields']
                    lookup_field = config['lookup_field']

                    field_data = {}

                    for field_name in fields:
                        value = row[col_pointer]

                        # Conversión especial para booleanos si el campo empieza con "is_"
                        if field_name.startswith('is_'):
                            value = str_to_bool(value)

                        field_data[field_name] = value
                        col_pointer += 1

                    # Lookup para obtener o crear instancia
                    if lookup_field in field_data:
                        lookup_value = field_data[lookup_field]
                        obj, created = model.objects.get_or_create(**{lookup_field: lookup_value})
                    else:
                        obj = model()

                    # Asignar campos
                    for key, value in field_data.items():
                        setattr(obj, key, value)

                    # Relaciones especiales
                    if lookup_field == 'user' and 'User' in instances:
                        setattr(obj, 'user', instances['User'])

                    obj.save()
                    instances[model.__name__] = obj

            except Exception as e:
                print(f"Error en la fila {row_number}: {e}")

@never_cache
@group_required('admin')
def export_users_csv(request):
    if not request.user.is_staff:
        return HttpResponse('No autorizado', status=403)

    if request.method == 'POST':
        try:
            headers = ['Username', 'First Name', 'Last Name', 'Email', 'Is Active', 'Is Staff', 'Is Superuser', 'Groups', 'Insignia', 'Num List', 'UID', 'Notes', 'Team', 'Image Name']
            users = User.objects.all().select_related('userprofile').prefetch_related('groups')
            rows = [
                [
                    user.username,
                    user.first_name,
                    user.last_name,
                    user.email,
                    user.is_active,
                    user.is_staff,
                    user.is_superuser,
                    ", ".join([group.name for group in user.groups.all()]),
                    (user.userprofile.insignia if hasattr(user, 'userprofile') and user.userprofile.insignia else ''),
                    (user.userprofile.num_list if hasattr(user, 'userprofile') and user.userprofile.num_list else ''),
                    (user.userprofile.uid if hasattr(user, 'userprofile') and user.userprofile.uid else ''),
                    (user.userprofile.notes if hasattr(user, 'userprofile') and user.userprofile.notes else ''),
                    (user.userprofile.team if hasattr(user, 'userprofile') and user.userprofile.team else ''),
                    (user.userprofile.image.name if hasattr(user, 'userprofile') and user.userprofile.image else ''),
                ]
                for user in users
            ]

            now = timezone.localtime(timezone.now()).strftime('%d%m%y%H%M%S')
            return create_csv(f'users_{now}.csv', headers, rows)
        except Exception as e:
            print(f'Error al exportar usuarios: {str(e)}', exc_info=True)
    print(f'Solicitud inválida de {request.user.username}')

@never_cache
@group_required('admin')
def export_users_csv(request):
    if not request.user.is_staff:
        return HttpResponse('No autorizado', status=403)
    
    if request.method == 'POST':
        try:
            fileCSV = request.FILES['fileUsersDoc']
            model_configs = [
                {
                    "model": User,
                    "fields": ['username', 'first_name', 'last_name', 'email', 'is_active', 'is_staff', 'is_superuser'],
                    "lookup_field": 'username',
                },
                {
                    "model": UserProfile,
                    "fields": ['insignia', 'num_list', 'uid', 'notes', 'team', 'image_name'],
                    "lookup_field": 'user',
                }
            ]

            return import_from_csv(fileCSV, model_configs)
        except Exception as e:
            print(f'Error al exportar usuarios: {str(e)}', exc_info=True)
    print(f'Solicitud inválida de {request.user.username}')