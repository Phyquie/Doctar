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

// Send Question Reply Email
export const sendQuestionReplyEmail = async ({ to, name, specialist, question, reply }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Doctar <mindclash5@gmail.com>',
      to,
      subject: 'Your question on Doctar has been answered',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #5f4191; margin: 0;">Doctar</h1>
            <p style="color: #666; margin: 5px 0;">Healthcare Platform</p>
          </div>
          <p style="color: #333;">Hi ${name || 'there'},</p>
          <p style="color: #333;">We have replied to your question.</p>
          <div style="background:#f8f9fa; padding:16px; border-radius:8px; margin:16px 0;">
            <p style="margin:0; color:#555;"><strong>Specialist:</strong> ${specialist}</p>
            <p style="margin:8px 0 0 0; color:#555;"><strong>Your Question:</strong><br/>${question}</p>
          </div>
          <div style="background:#e8f5e8; border-left:4px solid #5f4191; padding:16px; border-radius:8px;">
            <p style="margin:0; color:#333;"><strong>Our Reply:</strong></p>
            <p style="white-space:pre-wrap; color:#333;">${reply}</p>
          </div>
          <p style="color:#999; font-size:12px; margin-top:24px;">© ${new Date().getFullYear()} Doctar. All rights reserved.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Question Reply email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending question reply email:', error);
    throw new Error('Failed to send question reply email');
  }
};

// Booking emails
export const sendBookingConfirmationToPatient = async ({ to, patientName, doctorName, clinicName, clinicAddress, date, time, bookingType, visitType, homeVisitAddress }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Doctar <mindclash5@gmail.com>',
      to,
      subject: `Your booking is confirmed with Dr. ${doctorName} on ${date} at ${time}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #5f4191; margin: 0;">Doctar</h1>
            <p style="color: #666; margin: 5px 0;">Booking Confirmation</p>
          </div>
          <p style="color:#333;">Hi ${patientName || 'there'},</p>
          <p style="color:#333;">Your ${bookingType} appointment has been confirmed.</p>
          <div style="background:#f8f9fa; padding:16px; border-radius:8px; margin:16px 0;">
            <p style="margin:0; color:#555;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
            <p style="margin:4px 0; color:#555;"><strong>Date & Time:</strong> ${date}, ${time}</p>
            <p style="margin:4px 0; color:#555;"><strong>Visit Type:</strong> ${visitType.replace('-', ' ')}</p>
            ${clinicName ? `<p style="margin:4px 0; color:#555;"><strong>Clinic:</strong> ${clinicName}</p>` : ''}
            ${clinicAddress ? `<p style="margin:4px 0; color:#555;"><strong>Address:</strong> ${clinicAddress}</p>` : ''}
            ${bookingType === 'home-visit' && homeVisitAddress ? `<p style="margin:4px 0; color:#555;"><strong>Home Visit Address:</strong> ${homeVisitAddress}</p>` : ''}
          </div>
          <p style="color:#999; font-size:12px; margin-top:24px;">© ${new Date().getFullYear()} Doctar. All rights reserved.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw new Error('Failed to send booking confirmation email');
  }
};

export const sendNewBookingNotificationToDoctor = async ({ to, patientName, patientAccountEmail, guestEmail, guestPhone, guestGender, guestDob, guestAddress, guestPostalCode, guestCity, doctorName, clinicName, clinicAddress, date, time, bookingType, visitType, homeVisitAddress }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Doctar <mindclash5@gmail.com>',
      to,
      subject: `New ${bookingType} booking on ${date} at ${time}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #5f4191; margin: 0;">Doctar</h1>
            <p style="color: #666; margin: 5px 0;">New Booking Notification</p>
          </div>
          ${bookingType === 'home-visit' && homeVisitAddress ? `
          <div style="background:#fff7ee; padding:16px; border-radius:8px; margin:16px 0;">
            <p style="margin:0 0 8px 0; color:#333;"><strong>Home Visit Address</strong></p>
            <p style="margin:0; color:#555;">${homeVisitAddress}</p>
          </div>` : ''}
          <p style="color:#333;">Hello Dr. ${doctorName},</p>
          <p style="color:#333;">You have a new booking from <strong>${patientName}</strong>.</p>
          <div style="background:#f8f9fa; padding:16px; border-radius:8px; margin:16px 0;">
            <p style="margin:0; color:#555;"><strong>Date & Time:</strong> ${date}, ${time}</p>
            <p style="margin:4px 0; color:#555;"><strong>Booking Type:</strong> ${bookingType}</p>
            <p style="margin:4px 0; color:#555;"><strong>Visit Type:</strong> ${visitType.replace('-', ' ')}</p>
            ${clinicName ? `<p style="margin:4px 0; color:#555;"><strong>Clinic:</strong> ${clinicName}</p>` : ''}
            ${clinicAddress ? `<p style="margin:4px 0; color:#555;"><strong>Address:</strong> ${clinicAddress}</p>` : ''}
          </div>
          <div style="background:#eef7ff; padding:16px; border-radius:8px; margin:16px 0;">
            <p style="margin:0 0 8px 0; color:#333;"><strong>Account</strong></p>
            <p style="margin:0; color:#555;">Booked via account: ${patientAccountEmail || 'N/A'}</p>
          </div>
          ${(guestEmail || guestPhone || guestGender || guestDob || guestAddress || guestPostalCode || guestCity) ? `
          <div style="background:#fff7ee; padding:16px; border-radius:8px; margin:16px 0;">
            <p style=\"margin:0 0 8px 0; color:#333;\"><strong>Guest Details</strong></p>
            ${guestEmail ? `<p style=\"margin:0; color:#555;\"><strong>Email:</strong> ${guestEmail}</p>` : ''}
            ${guestPhone ? `<p style=\"margin:0; color:#555;\"><strong>Phone:</strong> ${guestPhone}</p>` : ''}
            ${guestGender ? `<p style=\"margin:0; color:#555;\"><strong>Gender:</strong> ${guestGender}</p>` : ''}
            ${guestDob ? `<p style=\"margin:0; color:#555;\"><strong>DOB:</strong> ${new Date(guestDob).toLocaleDateString()}</p>` : ''}
            ${guestAddress ? `<p style=\"margin:0; color:#555;\"><strong>Address:</strong> ${guestAddress}</p>` : ''}
            ${guestPostalCode ? `<p style=\"margin:0; color:#555;\"><strong>Postal Code:</strong> ${guestPostalCode}</p>` : ''}
            ${guestCity ? `<p style=\"margin:0; color:#555;\"><strong>City:</strong> ${guestCity}</p>` : ''}
          </div>` : ''}
          <p style="color:#999; font-size:12px; margin-top:24px;">© ${new Date().getFullYear()} Doctar. All rights reserved.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('New booking notification email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending new booking notification email:', error);
    throw new Error('Failed to send new booking notification email');
  }
};

// Booking request emails (before acceptance)
export const sendBookingRequestEmailToPatient = async ({ to, patientName, doctorName, clinicName, clinicAddress, date, time, bookingType, visitType, homeVisitAddress }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Doctar <mindclash5@gmail.com>',
      to,
      subject: `Your booking request sent to Dr. ${doctorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #5f4191; margin: 0;">Doctar</h1>
            <p style="color: #666; margin: 5px 0;">Booking Request</p>
          </div>
          ${bookingType === 'home-visit' && homeVisitAddress ? `
          <div style="background:#fff7ee; padding:16px; border-radius:8px; margin:16px 0;">
            <p style="margin:0 0 8px 0; color:#333;"><strong>Home Visit Address</strong></p>
            <p style="margin:0; color:#555;">${homeVisitAddress}</p>
          </div>` : ''}
          <p style="color:#333;">Hi ${patientName || 'there'},</p>
          <p style="color:#333;">Your ${bookingType} booking request has been sent to Dr. ${doctorName}. You'll receive a confirmation once the doctor accepts the request.</p>
          <div style="background:#f8f9fa; padding:16px; border-radius:8px; margin:16px 0;">
            <p style="margin:0; color:#555;"><strong>Requested:</strong> ${date}, ${time}</p>
            <p style="margin:4px 0; color:#555;"><strong>Visit Type:</strong> ${visitType.replace('-', ' ')}</p>
            ${clinicName ? `<p style="margin:4px 0; color:#555;"><strong>Clinic:</strong> ${clinicName}</p>` : ''}
            ${clinicAddress ? `<p style="margin:4px 0; color:#555;"><strong>Address:</strong> ${clinicAddress}</p>` : ''}
          </div>
          <p style="color:#999; font-size:12px; margin-top:24px;">© ${new Date().getFullYear()} Doctar. All rights reserved.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Booking request email to patient sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending booking request email to patient:', error);
    throw new Error('Failed to send booking request email to patient');
  }
};

export const sendBookingRequestEmailToDoctor = async ({ to, patientName, patientAccountEmail, guestEmail, guestPhone, guestGender, guestDob, guestAddress, guestPostalCode, guestCity, doctorName, clinicName, clinicAddress, date, time, bookingType, visitType, homeVisitAddress }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Doctar <mindclash5@gmail.com>',
      to,
      subject: `Booking request from ${patientName} for ${date} at ${time}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #5f4191; margin: 0;">Doctar</h1>
            <p style="color: #666; margin: 5px 0;">Booking Request</p>
          </div>
          ${bookingType === 'home-visit' && homeVisitAddress ? `
          <div style="background:#fff7ee; padding:16px; border-radius:8px; margin:16px 0;">
            <p style="margin:0 0 8px 0; color:#333;"><strong>Home Visit Address</strong></p>
            <p style="margin:0; color:#555;">${homeVisitAddress}</p>
          </div>` : ''}
          <p style="color:#333;">Hello Dr. ${doctorName},</p>
          <p style="color:#333;">You have a new booking request from <strong>${patientName}</strong>. Please review and accept to confirm the appointment.</p>
          <div style="background:#f8f9fa; padding:16px; border-radius:8px; margin:16px 0;">
            <p style="margin:0; color:#555;"><strong>Date & Time:</strong> ${date}, ${time}</p>
            <p style="margin:4px 0; color:#555;"><strong>Booking Type:</strong> ${bookingType}</p>
            <p style="margin:4px 0; color:#555;"><strong>Visit Type:</strong> ${visitType.replace('-', ' ')}</p>
            ${clinicName ? `<p style="margin:4px 0; color:#555;"><strong>Clinic:</strong> ${clinicName}</p>` : ''}
            ${clinicAddress ? `<p style="margin:4px 0; color:#555;"><strong>Address:</strong> ${clinicAddress}</p>` : ''}
          </div>
          <div style="background:#eef7ff; padding:16px; border-radius:8px; margin:16px 0;">
            <p style="margin:0 0 8px 0; color:#333;"><strong>Account</strong></p>
            <p style="margin:0; color:#555;">Booked via account: ${patientAccountEmail || 'N/A'}</p>
          </div>
          ${(guestEmail || guestPhone || guestGender || guestDob || guestAddress || guestPostalCode || guestCity) ? `
          <div style="background:#fff7ee; padding:16px; border-radius:8px; margin:16px 0;">
            <p style=\"margin:0 0 8px 0; color:#333;\"><strong>Guest Details</strong></p>
            ${guestEmail ? `<p style=\"margin:0; color:#555;\"><strong>Email:</strong> ${guestEmail}</p>` : ''}
            ${guestPhone ? `<p style=\"margin:0; color:#555;\"><strong>Phone:</strong> ${guestPhone}</p>` : ''}
            ${guestGender ? `<p style=\"margin:0; color:#555;\"><strong>Gender:</strong> ${guestGender}</p>` : ''}
            ${guestDob ? `<p style=\"margin:0; color:#555;\"><strong>DOB:</strong> ${new Date(guestDob).toLocaleDateString()}</p>` : ''}
            ${guestAddress ? `<p style=\"margin:0; color:#555;\"><strong>Address:</strong> ${guestAddress}</p>` : ''}
            ${guestPostalCode ? `<p style=\"margin:0; color:#555;\"><strong>Postal Code:</strong> ${guestPostalCode}</p>` : ''}
            ${guestCity ? `<p style=\"margin:0; color:#555;\"><strong>City:</strong> ${guestCity}</p>` : ''}
          </div>` : ''}
          <p style="color:#999; font-size:12px; margin-top:24px;">© ${new Date().getFullYear()} Doctar. All rights reserved.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Booking request email to doctor sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending booking request email to doctor:', error);
    throw new Error('Failed to send booking request email to doctor');
  }
};

export const sendBookingConfirmationToDoctor = async ({ to, patientName, doctorName, date, time, bookingType, visitType, homeVisitAddress }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Doctar <mindclash5@gmail.com>',
      to,
      subject: `Booking confirmed with ${patientName} on ${date} at ${time}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #5f4191; margin: 0;">Doctar</h1>
            <p style="color: #666; margin: 5px 0;">Booking Confirmed</p>
          </div>
          ${bookingType === 'home-visit' && homeVisitAddress ? `
          <div style="background:#fff7ee; padding:16px; border-radius:8px; margin:16px 0;">
            <p style="margin:0 0 8px 0; color:#333;"><strong>Home Visit Address</strong></p>
            <p style="margin:0; color:#555;">${homeVisitAddress}</p>
          </div>` : ''}
          <p style="color:#333;">Hello Dr. ${doctorName},</p>
          <p style="color:#333;">You have confirmed the ${bookingType} booking with <strong>${patientName}</strong>.</p>
          <div style="background:#f8f9fa; padding:16px; border-radius:8px; margin:16px 0;">
            <p style="margin:0; color:#555;"><strong>Date & Time:</strong> ${date}, ${time}</p>
            <p style="margin:4px 0; color:#555;"><strong>Visit Type:</strong> ${visitType.replace('-', ' ')}</p>
          </div>
          <p style="color:#999; font-size:12px; margin-top:24px;">© ${new Date().getFullYear()} Doctar. All rights reserved.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email to doctor sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending booking confirmation email to doctor:', error);
    throw new Error('Failed to send booking confirmation email to doctor');
  }
};
