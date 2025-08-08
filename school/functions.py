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
        allowed_groups = ['admin', 'professor', 'student', 'systems']
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
    
    # except IntegrityError:
    #         return {'datastatus': False, 'message': 'Error de integridad en la base de datos. Posible duplicado de datos.'}

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
def read_csv(file_uploaded, model_configs):
    decoded_file = file_uploaded.read().decode('utf-8').splitlines()
    reader = csv.reader(decoded_file)
    headers = next(reader)

    for row_number, row in enumerate(reader, start=2):
        instances = {}

        try:
            col_pointer = 0
            user_instance = None
            pending_groups = []

            for config in model_configs:
                model = config['model']
                fields = config['fields']
                lookup_field = config['lookup_field']

                field_data = {}

                for field_name in fields:
                    value = row[col_pointer]

                    if field_name.startswith('is_'):
                        value = str_to_bool(value)

                    field_data[field_name] = value
                    col_pointer += 1

                if model == User:
                    lookup_value = field_data[lookup_field]
                    user_instance, created = model.objects.get_or_create(**{lookup_field: lookup_value})

                    for key, value in field_data.items():
                        if key == 'groups':
                            group_names = [g.strip() for g in value.split(',')]
                            groups_found = []
                            for name in group_names:
                                group_obj = Group.objects.filter(name=name).first()
                                if group_obj:
                                    groups_found.append(group_obj)
                                else:
                                    default_group = Group.objects.filter(name="student").first()
                                    if default_group:
                                        groups_found.append(default_group)
                            pending_groups = groups_found
                        else:
                            setattr(user_instance, key, value)

                    user_instance.save()

                    if pending_groups:
                        user_instance.groups.set(pending_groups)

                elif model == UserProfile:
                    if not user_instance:
                        raise ValueError("No se pudo obtener el usuario para el perfil.")

                    try:
                        userprofile_instance = UserProfile.objects.get(user=user_instance)
                    except UserProfile.DoesNotExist:
                        userprofile_instance = UserProfile(user=user_instance)

                    for key, value in field_data.items():
                        setattr(userprofile_instance, key, value)
                    userprofile_instance.save()

        except IntegrityError as e:
            print(f"Error de integridad en la fila {row_number}: {e}")
            return JsonResponse({'datastatus': False, 'message': f'Error de integridad en la fila {row_number}'}, status=400)
        except Exception as e:
            print(f"Error en la fila {row_number}: {e}")
            return JsonResponse({'datastatus': False, 'message': f'Error en la fila {row_number} <br> verificar terminal'}, status=400)

    return JsonResponse({'datastatus': True, 'message': 'Usuarios importados correctamente.'}, status=200)

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
def import_users_csv(request):
    if not request.user.is_staff:
        return HttpResponse('No autorizado', status=403)
    
    if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        try:
            fileCSV = request.FILES['fileUsersDoc']
            model_configs = [
                {
                    "model": User,
                    "fields": ['username', 'first_name', 'last_name', 'email', 'is_active', 'is_staff', 'is_superuser', 'groups'],
                    "lookup_field": 'username',
                },
                {
                    "model": UserProfile,
                    "fields": ['insignia', 'num_list', 'uid', 'notes', 'team', 'image_name'],
                    "lookup_field": 'user',
                }
            ]

            return read_csv(fileCSV, model_configs)        
        except Exception as e:
            print(f'Error al importar usuarios: {str(e)}')
            return JsonResponse({'datastatus': False, 'message': f'Error al importar usuarios: {str(e)}'}, status=400)
    
    print(f'Solicitud inválida de {request.user.username}')
    return HttpResponse('Método no permitido', status=405)

def icons_list():
    return [
        'home-angle',
        'add-circle',
        'album-line',
        'bell-bing',
        'book-bookmark',
        'call-chat-rounded',
        'chat-round-line',
        'chat-round-line-broken',
        'chat-round-line-linear',
        'card-id',
        'cat',
        'chat-round-line',
        'cloud',
        'copy',
        'database',
        'devices',
        'earth',
        'fire',
        'gallery',
        'gallery-circle',
        'ghost',
        'key-minimalistic',
        'layers',
        'letter',
        'lock-keyhole',
        'lock-keyhole-unlocked',
        'login-3',
        'logout-3',
        'map-arrow-down',
        'map',
        'map-point',
        'map-point-search',
        'map-point-wave',
        'map-point-bold',
        'mention-circle',
        'minimalistic-magnifer',
        'moon-stars',
        'moon-stars-glint',
        'moon-stars_hover-glint',
        'mouse',
        'pause-circle',
        'pin-circle',
        'plain',
        'play-circle',
        'point-on-map',
        'refresh-circle',
        'settings',
        'settings-minimalistic',
        'user',
        'user-plus',
        'user-circle',
        'user-rounded',
        'users-group-two-rounded',
        'sun',
        'sun-big',
        'alarm-add',
        'alt-arrow-down',
        'alt-arrow-left',
        'alt-arrow-right',
        'alt-arrow-up',
        'backspace',
        'bag',
        'balls',
        'bell',
        'bell-off',
        'calendar',
        'camera',
        'camera-rotate',
        'code-scan',
        'compass',
        'cup-paper',
        'donut',
        'donut-bitten',
        'donut-hover-bitten',
        'danger-circle',
        'dollar',
        'end-call-rounded',
        'eye',
        'eye-line',
        'eye-closed-line',
        'eye-scan',
        'euro',
        'filter',
        'flash-drive',
        'gamepad',
        'heart',
        'heart-angle-broken',
        'heart-shine',
        'heart-angle-bold',
        'heart-pulse',
        'hashtag-circle',
        'hourglass',
        'hourglass-broken',
        'magic-stick',
        'masks',
        'pallete',
        'paperclip',
        'phone-calling-rounded',
        'phone-rounded',
        'qr-code',
        'routing',
        'running-line',
        'sd-card',
        'server-square',
        'server-square-cloud',
        'server-square-update',
        'signpost',
        'star',
        'streets-map-point',
        'subtitles',
        'trash-bin-minimalistic',
        'trash-bin-trash',
        'tuning',
        'user-id',
        'wallet-money',
        'widget-4',
        'widget-5',
        'window-frame',
        'tuning-square',
        'hamburger-menu-line',
        'menu-dots',
        'close-rounded',
        'gallery-wide',
        'monitor',
        'smartphone',
        'monitor-smartphone',
        'dots-fade',
        'posts-carousel-vertical',
        'posts-carousel-horizontal',
        'github-icon',
        'maximize-square',
        'square-bottom-up',
        'share',
        'shield-keyhole',
        'key',
        'box-minimalistic',
        'cursor-square',
        'calendar-mark',
        'calendar-mark-broken',
        'gps-bold',
        'gps-bold-duotone',
        'gps-broken',
        'gps-line-duotone',
        'gps-linear',
        'waterdrops',
        'waterdrops-line',
        'wind-bold',
        'wind-duotone',
        'wind-broken',
        'cloud-rain-bold-duotone',
        'cloud-rain-line-duotone',
        'cloud-bolt-bold-duotone',
        'cloud-snowfall-bold-duotone',
        'cloud-storm-bold-duotone',
        'clouds-bold-duotone',
        'cloudy-moon-bold-duotone',
        'cloud-sun-bold-duotone',
        'snowflake-bold-duotone',
        'fog-bold-duotone',
        'academic-cap',
        'folder-cut',
        'double-alt-arrow-left',
        'alt-arrow-left-line',
        'alt-arrow-right-line',
        'double-alt-arrow-right',
        'file-download-bold-duotone',
        'file-send-bold-duotone',
        'pen-bold-duotone',
        'sleeping-circle-bold-duotone',
        'bolt-circle-bold-duotone',
        'emoji-funny-circle-bold-duotone',
        'check-circle-bold-duotone',
        'close-circle-bold-duotone',
        'refresh-circle-bold-duotone',
        'confounded-circle-bold-duotone',
        'question-circle-bold-duotone',
        'history-bold-duotone',
        'history-broken',
        'history-line-duotone',
    ]