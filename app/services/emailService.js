import nodemailer from 'nodemailer';

// SMTP Configuration
const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'mindclash5@gmail.com',
    pass: process.env.SMTP_PASS || 'mygt iavf jbfe jhzg'
  }
};

// Create transporter
const transporter = nodemailer.createTransport(smtpConfig);

// Generate OTP
export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send OTP Email
export const sendOTPEmail = async (email, otp, phone) => {
  try {
    console.log('Sending OTP email to:', email);
    console.log('SMTP Config:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      user: smtpConfig.auth.user
    });
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Doctar <mindclash5@gmail.com>',
      to: email,
      subject: 'Doctar - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #5f4191; margin: 0;">Doctar</h1>
            <p style="color: #666; margin: 5px 0;">Healthcare Platform</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
            <p style="color: #666; margin-bottom: 20px;">
              Please use the following OTP to verify your email address:
            </p>
            
            <div style="background: #5f4191; color: white; font-size: 32px; font-weight: bold; 
                        padding: 20px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              This OTP is valid for 10 minutes. Do not share this code with anyone.
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              If you didn't request this verification, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2024 Doctar. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, firstName, role) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Doctar <mindclash5@gmail.com>',
      to: email,
      subject: `Welcome to Doctar, ${firstName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #5f4191; margin: 0;">Doctar</h1>
            <p style="color: #666; margin: 5px 0;">Healthcare Platform</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome to Doctar!</h2>
            <p style="color: #666; margin-bottom: 20px;">
              Hi ${firstName},
            </p>
            <p style="color: #666; margin-bottom: 20px;">
              Thank you for joining Doctar! Your ${role} account has been successfully created.
            </p>
            
            <div style="background: #e8f5e8; border-left: 4px solid #5f4191; padding: 15px; margin: 20px 0;">
              <h3 style="color: #5f4191; margin: 0 0 10px 0;">What's Next?</h3>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li>Complete your profile setup</li>
                <li>Explore our healthcare services</li>
                <li>Connect with medical professionals</li>
                <li>Book appointments easily</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
                 style="background: #5f4191; color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 6px; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2024 Doctar. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

export default transporter;
