// Admin API service for dashboard data
export class AdminService {
  static getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  static getAuthHeaders() {
    const token = this.getAuthToken();
    console.log('AdminService getAuthHeaders - token:', token ? 'Present' : 'Missing');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'token': token
    };
  }

  // Get dashboard statistics
  static async getDashboardStats() {
    try {
      const [usersResponse, doctorsResponse, blogsResponse, newsResponse, reviewsResponse] = await Promise.all([
        fetch('/api/admin/users?limit=1', {
          method: 'GET',
          headers: this.getAuthHeaders()
        }),
        fetch('/api/admin/doctor?limit=1', {
          method: 'GET',
          headers: this.getAuthHeaders()
        }),
        fetch('/api/blogs?limit=1', {
          method: 'GET',
          headers: this.getAuthHeaders()
        }),
        fetch('/api/news?limit=1', {
          method: 'GET',
          headers: this.getAuthHeaders()
        }),
        fetch('/api/reviews', {
          method: 'GET',
          headers: this.getAuthHeaders()
        })
      ]);

      const [usersData, doctorsData, blogsData, newsData, reviewsData] = await Promise.all([
        usersResponse.json(),
        doctorsResponse.json(),
        blogsResponse.json(),
        newsResponse.json(),
        reviewsResponse.json()
      ]);

      return {
        totalUsers: usersData.data?.pagination?.totalPatients || 0,
        totalDoctors: doctorsData.data?.pagination?.totalDoctors || 0,
        totalBlogs: blogsData.data?.pagination?.totalItems || 0,
        totalNews: newsData.data?.pagination?.totalItems || 0,
        totalReviews: reviewsData.reviews?.length || 0,
        appointments: 0, // This would need a separate appointments API
        pendingReviews: reviewsData.reviews?.filter(r => !r.isApproved)?.length || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalUsers: 0,
        totalDoctors: 0,
        totalBlogs: 0,
        totalNews: 0,
        totalReviews: 0,
        appointments: 0,
        pendingReviews: 0
      };
    }
  }

  // Get recent activity
  static async getRecentActivity() {
    try {
      const [usersResponse, doctorsResponse] = await Promise.all([
        fetch('/api/admin/users?limit=5', {
          method: 'GET',
          headers: this.getAuthHeaders()
        }),
        fetch('/api/admin/doctor?limit=5', {
          method: 'GET',
          headers: this.getAuthHeaders()
        })
      ]);

      const [usersData, doctorsData] = await Promise.all([
        usersResponse.json(),
        doctorsResponse.json()
      ]);

      const activities = [];

      // Add recent users
      if (usersData.data?.patients) {
        usersData.data.patients.forEach(patient => {
          activities.push({
            action: `${patient.firstName} ${patient.lastName} registered as patient`,
            time: new Date(patient.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
            type: 'user'
          });
        });
      }

      // Add recent doctors
      if (doctorsData.data?.doctors) {
        doctorsData.data.doctors.forEach(doctor => {
          activities.push({
            action: `Dr. ${doctor.firstName} ${doctor.lastName} registered as doctor`,
            time: new Date(doctor.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
            type: 'doctor'
          });
        });
      }

      // Sort by creation date and return latest 4
      return activities
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 4);

    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  // Get system status (mock data for now)
  static async getSystemStatus() {
    try {
      // Test API connectivity
      const testResponse = await fetch('/api/admin/users?limit=1', {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const isApiWorking = testResponse.ok;
      const isDbWorking = isApiWorking; // If API works, DB is working

      return [
        {
          service: 'API Server',
          status: isApiWorking ? 'Operational' : 'Down',
          statusType: isApiWorking ? 'success' : 'error'
        },
        {
          service: 'Database',
          status: isDbWorking ? 'Operational' : 'Down',
          statusType: isDbWorking ? 'success' : 'error'
        },
        {
          service: 'Image Storage',
          status: 'Minor Issues',
          statusType: 'warning'
        },
        {
          service: 'Email Service',
          status: 'Operational',
          statusType: 'success'
        }
      ];
    } catch (error) {
      console.error('Error checking system status:', error);
      return [
        {
          service: 'API Server',
          status: 'Down',
          statusType: 'error'
        },
        {
          service: 'Database',
          status: 'Down',
          statusType: 'error'
        },
        {
          service: 'Image Storage',
          status: 'Unknown',
          statusType: 'error'
        },
        {
          service: 'Email Service',
          status: 'Unknown',
          statusType: 'error'
        }
      ];
    }
  }

  // Get users list
  static async getUsers(page = 1, limit = 10) {
    try {
      const response = await fetch(`/api/admin/users?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get doctors list
  static async getDoctors(page = 1, limit = 10, search = '', specialization = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(specialization && { specialization })
      });

      const response = await fetch(`/api/admin/doctor?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }

  // Get blogs list with pagination
  static async getBlogs(page = 1, limit = 10, search = '', author = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(author && { author })
      });

      const response = await fetch(`/api/blogs?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  // Get single blog
  static async getBlog(blogId) {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch blog');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  }

  // Create blog
  static async createBlog(blogData) {
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(blogData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create blog');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  // Update blog
  static async updateBlog(blogId, blogData) {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(blogData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update blog');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  // Delete blog
  static async deleteBlog(blogId) {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete blog');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }

  // Get news list with pagination
  static async getNews(page = 1, limit = 10, search = '', author = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(author && { author })
      });

      const response = await fetch(`/api/news?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }

  // Get single news
  static async getNewsItem(newsId) {
    try {
      const response = await fetch(`/api/news/${newsId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }

  // Create news
  static async createNews(newsData) {
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(newsData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create news');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  }

  // Update news
  static async updateNews(newsId, newsData) {
    try {
      const response = await fetch(`/api/news/${newsId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(newsData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update news');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  }

  // Delete news
  static async deleteNews(newsId) {
    try {
      const response = await fetch(`/api/news/${newsId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete news');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  }

  // Get reviews list
  static async getReviews(doctorId = null) {
    try {
      const url = doctorId ? `/api/reviews?doctorId=${doctorId}` : '/api/reviews';
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  // Suspend/Unsuspend Doctor
  static async suspendDoctor(doctorId, isSuspended, reason = '') {
    try {
      console.log('Suspending doctor:', { doctorId, isSuspended, reason });
      const response = await fetch(`/api/admin/doctor/${doctorId}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          queryType: 'suspension',
          value: isSuspended,
          reason: reason
        })
      });

      console.log('Suspend response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Suspend error response:', errorData);
        throw new Error(errorData.error || 'Failed to update doctor status');
      }

      const result = await response.json();
      console.log('Suspend success:', result);
      return result;
    } catch (error) {
      console.error('Error suspending doctor:', error);
      throw error;
    }
  }

  // Delete Doctor
  static async deleteDoctor(doctorId) {
    try {
      console.log('Deleting doctor:', doctorId);
      const response = await fetch(`/api/admin/doctor/${doctorId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete error response:', errorData);
        throw new Error(errorData.error || 'Failed to delete doctor');
      }

      const result = await response.json();
      console.log('Delete success:', result);
      return result;
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw error;
    }
  }

  // Suspend/Unsuspend User
  static async suspendUser(userId, isSuspended, reason = '') {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          isSuspended: isSuspended,
          suspensionReason: reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  }

  // Delete User
  static async deleteUser(userId) {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Approve Doctor
  static async approveDoctor(doctorId, reason = '') {
    try {
      console.log('Approving doctor:', { doctorId, reason });
      const response = await fetch(`/api/admin/doctor/${doctorId}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          queryType: 'approval',
          value: true,
          reason: reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve doctor');
      }

      return await response.json();
    } catch (error) {
      console.error('Error approving doctor:', error);
      throw error;
    }
  }

  // Re-approve Doctor (unsuspend and approve)
  static async reapproveDoctor(doctorId, reason = '') {
    try {
      console.log('Re-approving doctor:', { doctorId, reason });
      // First unsuspend
      await this.suspendDoctor(doctorId, false, reason);
      // Then approve
      return await this.approveDoctor(doctorId, reason);
    } catch (error) {
      console.error('Error re-approving doctor:', error);
      throw error;
    }
  }

  // Reels Management
  static async getReels(page = 1, limit = 10, search = '', location = '', category = '', author = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(location && { location }),
        ...(category && { category }),
        ...(author && { author })
      });

      const response = await fetch(`/api/reels?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch reels');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching reels:', error);
      throw error;
    }
  }

  static async getReel(reelId) {
    try {
      const response = await fetch(`/api/reels/${reelId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch reel');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching reel:', error);
      throw error;
    }
  }

  static async createReel(reelData) {
    try {
      console.log('AdminService.createReel called with:', reelData);
      const response = await fetch('/api/reels', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(reelData)
      });

      console.log('Create reel response status:', response.status);
      const responseData = await response.json();
      console.log('Create reel response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create reel');
      }

      return responseData;
    } catch (error) {
      console.error('Error creating reel:', error);
      throw error;
    }
  }

  static async updateReel(reelId, reelData) {
    try {
      const response = await fetch(`/api/reels/${reelId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(reelData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update reel');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating reel:', error);
      throw error;
    }
  }

  static async deleteReel(reelId) {
    try {
      const response = await fetch(`/api/reels/${reelId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete reel');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting reel:', error);
      throw error;
    }
  }
}
