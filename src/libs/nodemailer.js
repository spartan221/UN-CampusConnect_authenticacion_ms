import nodemailer from 'nodemailer';
import {transporter} from '../index'

export const authToMailService = () => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: String(process.env.EMAIL),
        pass: String(process.env.PASS)
      }
    });
    return transporter;
  } catch (error) {
    console.log(error);    
  }
}

export const sendConfirmationEmail = async (toEmail, token) => {
  try {
    const mailOptions = {
      from: process.env.USER,
      to: toEmail,
      subject: 'Confirmación de correo electrónico',
      html: `
          <p>Para confirmar tu correo electrónico, introduce el siguiente código de activación: </p>
          <code>${token}</code>
        `
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo electrónico enviado: ${info.messageId}`);
  } catch (error) {
    console.error(error);
  }
};
