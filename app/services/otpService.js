import { generateOTP, sendOTPEmail } from './emailService';

// Store OTP in memory (in production, use Redis or database)
const otpStore = new Map();

// Generate and send OTP
export const generateAndSendOTP = async (email, phone) => {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    // Store OTP temporarily
    otpStore.set(email, {
      otp,
      expiresAt,
      phone,
      attempts: 0
    });
    
    // Send OTP via email
    await sendOTPEmail(email, otp, phone);
    
    return {
      success: true,
      message: 'OTP sent successfully',
      expiresAt
    };
  } catch (error) {
    console.error('Error generating and sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  try {
    const storedOTP = otpStore.get(email);
    
    if (!storedOTP) {
      return {
        success: false,
        message: 'OTP not found or expired'
      };
    }
    
    // Check if OTP has expired
    if (new Date() > storedOTP.expiresAt) {
      otpStore.delete(email);
      return {
        success: false,
        message: 'OTP has expired'
      };
    }
    
    // Check attempt limit
    if (storedOTP.attempts >= 3) {
      otpStore.delete(email);
      return {
        success: false,
        message: 'Too many failed attempts. Please request a new OTP'
      };
    }
    
    // Verify OTP
    if (storedOTP.otp !== otp) {
      storedOTP.attempts += 1;
      otpStore.set(email, storedOTP);
      
      return {
        success: false,
        message: 'Invalid OTP',
        attemptsLeft: 3 - storedOTP.attempts
      };
    }
    
    // OTP is correct
    otpStore.delete(email);
    
    return {
      success: true,
      message: 'OTP verified successfully'
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Failed to verify OTP');
  }
};

// Resend OTP
export const resendOTP = async (email, phone) => {
  try {
    // Clear any existing OTP for this email
    otpStore.delete(email);
    
    // Generate and send new OTP
    return await generateAndSendOTP(email, phone);
  } catch (error) {
    console.error('Error resending OTP:', error);
    throw new Error('Failed to resend OTP');
  }
};

// Clean expired OTPs (call this periodically)
export const cleanExpiredOTPs = () => {
  const now = new Date();
  for (const [email, otpData] of otpStore.entries()) {
    if (now > otpData.expiresAt) {
      otpStore.delete(email);
    }
  }
};

// Set up periodic cleanup (every 5 minutes)
setInterval(cleanExpiredOTPs, 5 * 60 * 1000);
