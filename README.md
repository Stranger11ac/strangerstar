# Stanger Star Website
Multiples aplicaciones web

## Instalacion
 
Se requiere python 3.12.0 o superior y pip.
Para instalar todas las dependencias de python ANTES se debe tener **RUST** instalado, esto se puede verificar con:
```bash
rustc --version
cargo --version
```

### Entorno Virtual

Antes de ejecutar el entorno virtual, para mas comodidad se recomienda tener registrado los scripts de python en las **variables de entorno del sistema** (Path) y de esta forma poder ejecutar los modulos de python sin necesidad de invocar python directamente. Ejemplo de direccion de scripts de python:
```bash
C:\Users\username\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13\LocalCache\local-packages\Python313\Scripts
```
Ademas de ello se requiere cambiar la politica de ejecución de scripts está restringida por seguridad de **PowerShell** ya que esto impide que la terminal pueda ejecutar scripts de forma nativa, esta configuracion no permite que el entorno virtual este activo constante mente, para cambiarlo ejecute lo siguiente:
```bash
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Configura el entorno virtual para instalar las dependencias de python.
```bash
pip install virtualenv
virtualenv venv
```

Activar el Entorno virtual para trabajar en él y ejecutar python del entorno virtual en lugar de utilizarlo globalmente.
```bash
venv\Scripts\activate
```
Despues de activar el entorno virtual se recomeinza volver a inicializar su editor de codigo; por ejemplo con Visual Studio Code unicamente cerrar el programa y volver a abrirlo. Posteriormente se debe especificar el Selector Interpreter: **Ctrl + SHIFT + P**. seleccione la carpeta del proyecto y el python de su entorno virtual; **Python "version" ('venv':venv) .\venv\Scripts\python.exe**


### Requerimientos del Proyecto
Instala las dependencias definidas en requirements.txt, esto se debe instalar dentro de tu entorno virtual:
```bash
pip install -r requirements.txt
```

## Iniciar Django

### Base de Datos
Crear las tablas de los modelos definidos y los modelos iniciales propios de Django.
```bash
python manage.py makemigrations
python manage.py migrate
```

![note](https://img.shields.io/badge/NOTA-Importante-blue)

Las aplicaciones creadas deben estar definidas en el proyecto, se definen en **INSTALLED_APPS** de settings.py [`\project\settings.py`](/project/settings.py)

### Crear Usuario Administrador
Este es un usuario importante para manjar tanto la base de datos como el uso de las tablas y modelos locales de DJango.
Antes de crearlo se requiere un nombre de usuario, email (opcional) y una contraseña que se repetirá para completar el proceso.
```bash
python manage.py createsuperuser
```

### Levantar servidor local

Ejecuta:
```bash
py manage.py runserver
```

Despues puedes acceder a [http://127.0.0.1:8000/](http://127.0.0.1:8000/) o puedes hacer click en el mismo link en la terminal si es que lo permite.

## Desarrollo

Ejecuta:
```bash
py manage.py collectstatic
```
Esto creara una carpeta de static en la raiz, ademas de contener los documentos estaticos personalizados tambien se hace la coleccion de los documentos estaticos de admin, esto pertenece a django
