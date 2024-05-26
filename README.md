# Prueba - Skate Park

## Descripción
La Municipalidad de Santiago, ha organizado una competencia de Skate para impulsar el nivel
deportivo de los jóvenes que desean representar a Chile en los X Games del próximo año, y
han iniciado con la gestión para desarrollar la plataforma web en la que los participantes se
podrán registrar y revisar el estado de su solicitud
En esta prueba deberás ocupar todos tus conocimientos para desarrollar un sistema que
involucre tus habilidades como Full Stack Developer, consolidando tus competencias en el
frontend y backend.
Las tecnologías y herramientas que deberás ocupar son las siguientes:
- Express
- Handlebars
- PostgreSQL
- JWT
- Express-fileupload

## Requerimientos
1. Crear una API REST con el Framework Express (3 Puntos)
2. Servir contenido dinámico con express-handlebars (3 Puntos)
3. Ofrecer la funcionalidad Upload File con express-fileupload (2 Puntos)
4. Implementar seguridad y restricción de recursos o contenido con JWT (2 Puntos)

## Instalación 🔧
1. Clona este repositorio.
2. Instala las dependencias por la terminal con npm:
- npm install
3. Configura las variables de entorno creando un archivo .env en la raíz del proyecto:
DB_PASSWORD=TuContraseña
DB_USER=TuUsuario
DB_DATABASE=NombreDeTuBaseDeDatos
DB_HOST=TuHost
DB_PORT=TuPuerto
4. Inicia el servidor por la terminal:
- nodemon index

## Funcionalidades
- Registrar nuevos participantes
- Iniciar sesion con email y password
- Autenticar a un usuario con sus credenciales.
- Generar un token con JWT.
- Modificar datos personales segun cada cuenta.
- Cada usuario puede eliminar su cuenta.
- Visualizar a todos los usuarios.
- El administrador puede cambiar los estados de cada usuario: En revision-Aprobado.

## Tecnologías Utilizadas
- Express
- Handlebars
- PostgreSQL
- JWT
- Express-fileupload


## Autor
- Danicsa Calderón - [GitHub](https://github.com/DaniCalderonM)

![bulldog-dog](https://github.com/DaniCalderonM/PruebaSkatePark/assets/128839529/b741a1f0-a150-4880-b53d-d6ac13b454e3)
