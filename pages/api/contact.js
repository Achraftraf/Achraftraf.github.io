import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use any email service here
      auth: {
        user: 'achrafdev529@gmail.com', // Your email address
        pass: 'mbob obsv gwzw snjb', // Your email password or app password

      },
    });

    // Email options
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // Your email address
      subject: `New contact form submission from ${name}`,
      text: `
        You have received a new message from your website contact form.
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
