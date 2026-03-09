# Plan Detallado V2: Aut Major League Tournament

Este documento detalla los pasos a seguir para la refactorización y escalabilidad del proyecto, pasando de una prueba de concepto en MongoDB a un sistema robusto y escalable en PostgreSQL.

## 1. Migración a PostgreSQL y Docker (Railway & Vercel)
- **Base de Datos**: Reemplazar Mongoose/MongoDB por **PostgreSQL**. Se sugiere usar **Prisma ORM** o **TypeORM** para manejar la base de datos relacional.
- **Dockerización**: 
  - Crear un `docker-compose.yml` en la raíz para levantar PostgreSQL (y opcionalmente Redis para cacheo de la API de Riot).
  - Crear `Dockerfile` para el backend.
- **Hosting**: El backend y la DB se desplegarán en Railway. El frontend seguirá en Vercel.

## 2. Escalabilidad: Múltiples Torneos, Equipos y Usuarios
El modelo de datos pasará a ser relacional para soportar:
- **Usuarios (Users)**: Cada jugador o capitán tendrá una cuenta única.
- **Equipos (Teams)**: Un usuario puede crear un equipo (y ser capitán).
- **Invitaciones**: Los capitanes podrán generar links de invitación o buscar perfiles y enviar solicitudes ("TeamMembers" con estado pendiente/aceptado).
- **Torneos (Tournaments)**: Múltiples torneos activos y pasados. Los equipos se inscriben a torneos específicos.
- **Partidas (Matches)**: Relacionadas estrictamente a un Torneo y a dos Equipos inscritos.

## 3. Autenticación Única con Google
- Eliminar el login dinámico/inseguro basado en `.env`.
- Implementar **Google OAuth2**. 
- Flujo: El Frontend obtiene el token de Google -> Backend lo valida -> Crea/Busca el usuario en PostgreSQL -> Retorna un JWT de sesión.
- Ventajas: Cero envíos de mail de confirmación, mayor seguridad y rapidez.

## 4. Perfiles Enlazados con Riot Games (League of Legends)
- Agregar un módulo para conectar con la **Riot Games API**.
- Los usuarios, una vez logueados con Google, deberán vincular su cuenta de LoL proporcionando su Riot ID (Game Name + Tagline).
- El backend verificará la existencia de la cuenta y guardará el `puuid` asociado al usuario para futuras consultas automáticas de estadísticas.

## 5. Panel de Administración
- **Acceso Restringido**: Rutas protegidas que validan si el `User.role === 'ADMIN'`.
- **Admin Inicial**: Se configurará `cordeiromariano17@gmail.com` como el primer Super Admin. 
- **Funcionalidades**:
  - Crear, editar y establecer Torneos como "Live" o "Finished".
  - Gestionar las llaves (brackets) de los torneos.
  - Subir resultados de las partidas de forma manual o validándolas.
  - Añadir otros administradores.

---
*Progreso a seguir actualizado iterativamente a medida que se ejecuten las fases.*
