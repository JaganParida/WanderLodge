import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Security Check: Verify Server API Key to prevent abuse
  const apiKey = req.headers['x-server-api-key'];
  if (!process.env.SERVER_API_KEY || apiKey !== process.env.SERVER_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized. Invalid API Key.' });
  }

  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  try {
    let transporter;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      return res.status(500).json({ error: "EMAIL_USER and EMAIL_PASS are not configured on Vercel." });
    }

    const mailOptions = {
      from: `"WanderLodge Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Email sent successfully via Vercel' });
  } catch (error) {
    console.error('Vercel Email Error:', error);
    return res.status(500).json({ error: 'Failed to send email via Vercel.', details: error.message });
  }
}
