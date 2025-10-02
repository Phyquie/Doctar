// Authentication service for API calls
export class AuthService {
  static async login(email, password) {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // For development, simulate successful login
      console.log('Simulating login for:', email);
      return {
        user: {
          id: '1',
          email: email,
          firstName: 'John',
          lastName: 'Doe',
          role: 'patient',
          avatar: '/icons/user-placeholder.png'
        },
        token: 'mock-jwt-token',
        role: 'patient',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          email: email,
          phone: '+1234567890',
          dateOfBirth: '1990-01-01',
          gender: 'male',
          address: '123 Main St',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001'
        }
      };
    }
  }

  static async register(userData) {
    try {
      // Determine the correct API endpoint based on role
      const endpoint = userData.role === 'doctor' ? '/api/auth/register-doctor' : '/api/auth/register-patient';
      
      // Simulate API call - replace with actual API endpoint
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // For development, simulate successful registration
      console.log('Simulating registration for:', userData.email, 'as', userData.role);
      
      const baseProfile = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone
      };

      if (userData.role === 'doctor') {
        return {
          user: {
            id: '1',
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: 'doctor',
            avatar: '/icons/doctor.png'
          },
          token: 'mock-jwt-token',
          role: 'doctor',
          profile: {
            ...baseProfile,
            specialization: userData.specialization,
            experience: userData.experience,
            licenseNumber: userData.licenseNumber,
            medicalCouncil: userData.medicalCouncil,
            practiceName: userData.practiceName,
            practiceAddress: userData.practiceAddress,
            consultationFee: userData.consultationFee,
            languages: userData.languages,
            bio: userData.bio,
            qualifications: userData.qualifications,
            achievements: userData.achievements,
            publications: userData.publications,
            workingHours: userData.workingHours,
            onlineConsultation: userData.onlineConsultation,
            emergencyContact: userData.emergencyContact
          }
        };
      } else {
        return {
          user: {
            id: '1',
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: 'patient',
            avatar: '/icons/user-placeholder.png'
          },
          token: 'mock-jwt-token',
          role: 'patient',
          profile: {
            ...baseProfile,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            location: userData.location,
            language: userData.language,
            isPhoneVerified: userData.isPhoneVerified || false,
            address: userData.address,
            city: userData.city,
            state: userData.state,
            pincode: userData.pincode,
            emergencyContact: userData.emergencyContact,
            medicalHistory: userData.medicalHistory,
            allergies: userData.allergies,
            bloodGroup: userData.bloodGroup,
            insurance: userData.insurance
          }
        };
      }
    }
  }

  static async forgotPassword(email) {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset request failed');
      }

      return await response.json();
    } catch (error) {
      // For development, simulate successful password reset request
      console.log('Simulating password reset for:', email);
      return { success: true, message: 'Password reset instructions sent to your email' };
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }

      return await response.json();
    } catch (error) {
      // For development, simulate successful password reset
      console.log('Simulating password reset with token:', token);
      return { success: true, message: 'Password reset successfully' };
    }
  }

  static async updateProfile(userId, profileData) {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch(`/api/auth/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }

      return await response.json();
    } catch (error) {
      // For development, simulate successful profile update
      console.log('Simulating profile update for user:', userId);
      return { success: true, profile: profileData };
    }
  }

  static async logout() {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      // For development, simulate successful logout
      console.log('Simulating logout');
      return { success: true };
    }
  }

  static async verifyEmail(token) {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch(`/api/auth/verify-email?token=${token}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email verification failed');
      }

      return await response.json();
    } catch (error) {
      // For development, simulate successful email verification
      console.log('Simulating email verification with token:', token);
      return { success: true, message: 'Email verified successfully' };
    }
  }

  static async resendVerificationEmail(email) {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend verification email');
      }

      return await response.json();
    } catch (error) {
      // For development, simulate successful resend
      console.log('Simulating resend verification for:', email);
      return { success: true, message: 'Verification email sent' };
    }
  }
}
