Club Gastronómico API

    API backend para plataforma SaaS multi-tenant orientada a la gestión de negocios gastronómicos.
    Construida con Node.js + Express + TypeScript + MongoDB, aplicando Arquitectura Hexagonal y Clean Architecture.

    Incluye módulo completo de autenticación, usuarios y roles, documentación Swagger y automatizaciones con n8n.

🚀 Tecnologías
        Node.js
        Express
        TypeScript
        MongoDB + Mongoose
        JWT Authentication
        Swagger
        Nodemailer
        n8n (webhooks)
        Arquitectura Hexagonal (Ports & Adapters)

        ⚙️ Instalación

1️⃣ Clonar el repositorio

git clone https://github.com/ramirezaed/ClubGastronomicoAPI.git

2️⃣ Instalar dependencias

npm install

3️⃣ Crear archivo .env en la raíz del proyecto
DB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/DB_NAME

CLIENT_URL=http://localhost:3000

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_RESET_SECRET=your_reset_secret

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_user
SMTP_PASS=your_pass
SMTP_FROM="Club Gastronomico <no-reply@club.com>"

N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/NewUser

4️⃣ Ejecutar el proyecto

npm run server
Servidor disponible en: http://localhost:5000

Swagger disponible en:

http://localhost:5000/api/docs


## 📖 Descripción del Proyecto

Club Gastronómico API es una plataforma SaaS multi-tenant diseñada para la gestión de negocios gastronómicos.

La aplicación permite que cada empresa administre de forma independiente su operación, incluyendo usuarios, menú de productos, pedidos y reportes de ventas, compartiendo una misma infraestructura pero manteniendo el aislamiento de la información entre compañías.

El sistema implementa distintos planes de suscripción (Free y Premium), habilitando funcionalidades específicas según el nivel contratado.

### Funcionalidades principales

#### 🔐 Gestión de identidad y acceso

* Registro e inicio de sesión de usuarios
* Autenticación mediante JWT y Refresh Tokens
* Recuperación y cambio de contraseña
* Gestión de roles y permisos
* Control de acceso basado en roles

#### 🏢 Gestión de empresas

* Registro y administración de compañías
* Arquitectura multi-tenant
* Activación y desactivación de empresas
* Gestión de planes de suscripción

#### 🍽️ Gestión de menú

* Administración de categorías
* Gestión de productos del menú
* Activación y desactivación de productos
* Consulta optimizada para integraciones externas

#### 🛒 Gestión de pedidos

* Creación manual de órdenes
* Registro de pedidos desde Telegram
* Actualización de estados
* Cancelación de pedidos
* Historial completo de operaciones

#### 📊 Reportes y analítica

**Plan Free**

* Ventas por período
* Productos más vendidos
* Reportes de cancelaciones

**Plan Premium**

* Evolución de ventas
* Ranking completo de productos
* Análisis de días con mayor demanda
* Análisis de franjas horarias
* Métricas avanzadas para la toma de decisiones

#### 🤖 Integración con IA y Telegram

La plataforma incluye una integración con Telegram que permite recibir pedidos desde un bot conversacional asistido por IA, registrando automáticamente las órdenes dentro del sistema.

#### ⚡ Automatizaciones con n8n

Se utilizan flujos automatizados mediante n8n para la ejecución de procesos administrativos y envío de notificaciones al Super Admin ante eventos relevantes del sistema.

### 🏗️ Arquitectura

El proyecto fue desarrollado siguiendo los principios de Clean Architecture y Arquitectura Hexagonal (Ports & Adapters), separando claramente las capas de Dominio, Aplicación e Infraestructura.

Este enfoque permite:

* Bajo acoplamiento entre componentes
* Mayor mantenibilidad
* Facilidad para realizar pruebas
* Escalabilidad de nuevas funcionalidades
* Independencia de frameworks y tecnologías externas

