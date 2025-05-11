import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

// Fix email password by removing spaces
const fixedEmailPass = process.env.EMAIL_PASS.replace(/\s+/g, '');
process.env.EMAIL_PASS = fixedEmailPass;

console.log('Testing email configuration with the following settings:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', '*'.repeat(process.env.EMAIL_PASS.length) + ' (hidden for security)');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test email connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
    
    // Provide troubleshooting guidance
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure the app password is correct (no spaces)');
    console.log('2. Ensure "Less secure app access" is enabled in your Google account');
    console.log('3. If using 2FA, confirm you\'re using an app password, not your regular password');
    console.log('4. Check if your Gmail account has any security restrictions');
    
  } else {
    console.log('Email server connection successful! Server is ready to send messages.');
    
    // Send a test email
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'EduHub Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #00897b; text-align: center;">EduHub Email Test</h2>
          <p>This is a test email to verify that the EduHub email system is working correctly.</p>
          <p>If you received this email, the configuration is correct!</p>
          <p>Time sent: ${new Date().toLocaleString()}</p>
        </div>
      `
    };
    
    transporter.sendMail(testEmail, (err, info) => {
      if (err) {
        console.error('Test email sending failed:', err);
      } else {
        console.log('Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      process.exit();
    });
  }
}); 