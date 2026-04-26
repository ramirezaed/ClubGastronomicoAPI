// import nodemailer from "nodemailer";
// import { IEmailService } from "@/modules/users/domain/services/IEmailService";

// export class NodemailerEmailService implements IEmailService {
//   private transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT),
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   async sendPasswordReset(to: string, resetToken: string): Promise<void> {
//     const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

//     await this.transporter.sendMail({
//       from: process.env.SMTP_FROM,
//       to,
//       subject: "Restablecer contraseña",
//       html: `
//         <p>Recibimos una solicitud para restablecer tu contraseña.</p>
//         <p>Este enlace expira en 15 minutos.</p>
//         <a href="${resetUrl}">Restablecer contraseña</a>
//         <p>Si no solicitaste esto, ignora este correo.</p>
//       `,
//     });
//   }
// }

import nodemailer from "nodemailer";
import { IEmailService } from "@/modules/users/domain/services/IEmailService";

export class NodemailerEmailService implements IEmailService {
  private transporter;

  constructor() {
    console.log("SMTP HOST:", process.env.SMTP_HOST);
    console.log("SMTP PORT:", process.env.SMTP_PORT);

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordReset(to: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: "Restablecer contraseña",
      html: `
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Este enlace expira en 15 minutos.</p>
        <a href="${resetUrl}">Restablecer contraseña</a>
      `,
    });
  }
}
