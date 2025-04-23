const express = require('express');
     const sgMail = require('@sendgrid/mail');
     const cors = require('cors');
     require('dotenv').config();

     const app = express();
     const PORT = process.env.PORT || 5000;

     // Middleware
     app.use(cors());
     app.use(express.json());

     // Set SendGrid API key
     sgMail.setApiKey(process.env.SENDGRID_API_KEY);

     // Endpoint to send email
     app.post('/api/send-email', async (req, res) => {
       const { to, subject, body } = req.body;

       if (!to || !subject || !body) {
         return res.status(400).json({ error: 'Missing required fields: to, subject, and body are required.' });
       }

       const msg = {
         to,
         from: process.env.SENDGRID_FROM_EMAIL, // Your verified sender email
         subject,
         text: body,
       };

       try {
         await sgMail.send(msg);
         console.log('Email sent successfully:', { to, subject });
         res.status(200).json({ message: 'Email sent successfully' });
       } catch (error) {
         console.error('Error sending email:', error);
         res.status(500).json({ error: 'Failed to send email', details: error.message });
       }
     });

     // Start the server
     app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
     });