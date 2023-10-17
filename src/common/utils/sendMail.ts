import nodemailer, { SendMailOptions } from 'nodemailer';
import AppError from './appError';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// test transporter
transporter.verify(function (error) {
  if (error) {
    throw new AppError('sending mail failed', 500, error as unknown as string);
  } else {
    console.log('Ready for messages');
  }
});

export async function sendMail(mailOptions: SendMailOptions) {
  try {
    transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.log(error);
  }
}
