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
