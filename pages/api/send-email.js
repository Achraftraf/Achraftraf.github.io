// pages/api/send-email.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New contact form submission from ${name}`,
      text: `
        You have received a new message from your website contact form.
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
      console.error('Error sending email:', error.message);
      res.status(500).json({ message: `Error sending email: ${error.message}` });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
