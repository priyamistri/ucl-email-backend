const express = require('express');
const multer = require('multer');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Setup Multer correctly
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

// ✅ Health check route (optional)
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// ✅ Email send endpoint
app.post('/send-email', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
        from: '"University Classrooms" priyammistry1313@gmail.com',
        to: [
            'jaybhavikpatel2015@gamil.com',
            'pmistri@asu.edu',
          ],
        subject: 'Monday Rounds',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #800020;">👋 Greeting of the Day!</h2>
            <p>
              Please find the attached PDF file containing the <strong>Monday Rounds Report</strong>.
            </p>
            <p>
              If you have any questions or feedback, feel free to get in touch.
            </p>
            <p style="margin-top: 20px;">
              Have a <strong>wonderful weekend</strong>! 🌞
            </p>
            <hr style="margin-top: 30px; margin-bottom: 10px;" />
            <p style="font-size: 0.9em; color: #888;">
              This is an automated email. Please do not reply.
            </p>
          </div>
        `,
        attachments: [
          {
            filename: 'MondayReport.pdf',
            content: req.file.buffer
          }
        ]
      };
      

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent!' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).send('Error sending email');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
