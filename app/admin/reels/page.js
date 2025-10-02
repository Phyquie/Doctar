'use client';

import { useState, useEffect } from 'react';
import { AdminService } from '../../services/adminService';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaVideo, FaClock } from 'react-icons/fa';

export default function ReelsManagementPage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingReel, setEditingReel] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    reels: 0,
    shorts: 0,
    featured: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iframeUrl: '',
    thumbnail: '',
    location: '',
    category: 'reel',
    duration: 60,
    tags: [],
    author: '',
    isFeatured: false
  });

  useEffect(() => {
    fetchReels();
    fetchDoctors();
  }, [currentPage, searchTerm, categoryFilter, locationFilter, authorFilter]);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getReels(
        currentPage, 
        itemsPerPage, 
        searchTerm, 
        locationFilter, 
        categoryFilter, 
        authorFilter
      );
      if (response.success) {
        setReels(response.data.reels);
        setTotalPages(response.data.pagination.totalPages);
        setStats(calculateStats(response.data.reels));
      } else {
        setError('Failed to fetch reels');
      }
    } catch (err) {
      console.error('Error fetching reels:', err);
      setError('Failed to fetch reels');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      console.log('Fetching doctors...');
      const response = await AdminService.getDoctors(1, 100);
      console.log('Doctors response:', response);
      if (response.success) {
        const doctorsList = response.data.doctors || [];
        setDoctors(doctorsList);
        console.log('Doctors set:', doctorsList);
        
        // Auto-select first doctor if none selected
        if (doctorsList.length > 0 && !formData.author) {
          setFormData(prev => ({ ...prev, author: doctorsList[0]._id }));
        }
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const calculateStats = (reelsList) => {
    const total = reelsList.length;
    const reels = reelsList.filter(r => r.category === 'reel').length;
    const shorts = reelsList.filter(r => r.category === 'short').length;
    const featured = reelsList.filter(r => r.isFeatured).length;
    return { total, reels, shorts, featured };
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleLocationFilter = (e) => {
    setLocationFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleAuthorFilter = (e) => {
    setAuthorFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleCreateReel = () => {
    console.log('Create Reel button clicked');
    setEditingReel(null);
    setFormData({
      title: '',
      description: '',
      iframeUrl: '',
      thumbnail: '',
      location: '',
      category: 'reel',
      duration: 60,
      tags: [],
      author: '',
      isFeatured: false
    });
    console.log('Setting showForm to true');
    setShowForm(true);
    console.log('showForm should now be true');
  };

  const handleTestCreate = async () => {
    try {
      // First check if we have doctors
      console.log('Available doctors:', doctors);
      
      if (doctors.length === 0) {
        alert('No doctors available. Please add a doctor first.');
        return;
      }

      const testData = {
        title: 'Test Reel',
        description: 'This is a test reel description',
        iframeUrl: '<iframe src=\'https://www.youtube.com/embed/dQw4w9WgXcQ\' width=\'300\' height=\'200\' frameborder=\'0\' allowfullscreen></iframe>',
        thumbnail: 'https://picsum.photos/300/200',
        location: 'Mumbai',
        category: 'reel',
        duration: 60,
        tags: ['test', 'demo'],
        author: doctors[0]._id,
        isFeatured: false
      };
      
      console.log('Testing with data:', testData);
      console.log('Selected author ID:', doctors[0]._id);
      
      const result = await AdminService.createReel(testData);
      console.log('Test create result:', result);
      alert('Test reel created successfully!');
      fetchReels();
    } catch (error) {
      console.error('Error creating test reel:', error);
      alert('Failed to create test reel: ' + error.message);
    }
  };

  const handleEditReel = (reel) => {
    setEditingReel(reel);
    setFormData({
      title: reel.title,
      description: reel.description,
      iframeUrl: reel.iframeUrl,
      thumbnail: reel.thumbnail,
      location: reel.location,
      category: reel.category,
      duration: reel.duration,
      tags: reel.tags,
      author: reel.author._id,
      isFeatured: reel.isFeatured
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    console.log('Available doctors:', doctors);
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.iframeUrl || !formData.location || !formData.author) {
      console.log('Validation failed - missing required fields');
      console.log('Title:', formData.title);
      console.log('Description:', formData.description);
      console.log('IframeUrl:', formData.iframeUrl);
      console.log('Location:', formData.location);
      console.log('Author:', formData.author);
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      console.log('Submitting form data:', formData);
      if (editingReel) {
        console.log('Updating reel:', editingReel._id);
        await AdminService.updateReel(editingReel._id, formData);
      } else {
        console.log('Creating new reel');
        const result = await AdminService.createReel(formData);
        console.log('Create result:', result);
      }
      setShowForm(false);
      setEditingReel(null);
      setFormData({
        title: '',
        description: '',
        iframeUrl: '',
        thumbnail: '',
        location: '',
        category: 'reel',
        duration: 60,
        tags: [],
        author: '',
        isFeatured: false
      });
      fetchReels();
      alert('Reel saved successfully!');
    } catch (error) {
      console.error('Error saving reel:', error);
      alert('Failed to save reel: ' + error.message);
    }
  };

  const handleDeleteReel = async (reelId) => {
    if (confirm('Are you sure you want to delete this reel?')) {
      try {
        await AdminService.deleteReel(reelId);
        alert('Reel deleted successfully!');
        fetchReels();
      } catch (error) {
        console.error('Error deleting reel:', error);
        alert('Failed to delete reel: ' + error.message);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Reels & Shorts Management</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  console.log('Current showForm state:', showForm);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reels & Shorts Management</h1>
        <div className="flex gap-2">
          <button
            onClick={handleCreateReel}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
          >
            <FaPlus className="mr-2" />
            Create Reel/Short
          </button>
          <button
            onClick={handleTestCreate}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            Test Create
          </button>
          <button
            onClick={() => {
              console.log('Force show form clicked');
              alert('Force show form clicked - check if modal appears');
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            Force Show Form
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaVideo className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Content</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaVideo className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reels</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reels}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Shorts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.shorts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaCalendarAlt className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reels..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={handleCategoryFilter}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="reel">Reels</option>
            <option value="short">Shorts</option>
          </select>
          
          <input
            type="text"
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={handleLocationFilter}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
          <select
            value={authorFilter}
            onChange={handleAuthorFilter}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Authors</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reels Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reels.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No reels found.
                </td>
              </tr>
            ) : (
              reels.map((reel) => (
                <tr key={reel._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {reel.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reel.category === 'reel' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reel.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mr-1" />
                      {reel.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaUser className="w-4 h-4 text-gray-400 mr-1" />
                      Dr. {reel.author?.firstName} {reel.author?.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaClock className="w-4 h-4 text-gray-400 mr-1" />
                      {Math.floor(reel.duration / 60)}:{(reel.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reel.isFeatured ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Featured
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditReel(reel)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteReel(reel._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === i + 1
                    ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center" 
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          onClick={() => setShowForm(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {editingReel ? 'Edit Reel/Short' : 'Create New Reel/Short'}
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="reel">Reel</option>
                    <option value="short">Short</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                    max="300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <select
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Author</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.firstName} {doctor.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  required
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Iframe Code</label>
                <textarea
                  value={formData.iframeUrl}
                  onChange={(e) => setFormData({ ...formData, iframeUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                  placeholder="Paste your iframe code here"
                  required
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="health, wellness, tips"
                />
              </div>
              
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                  Featured content
                </label>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
                >
                  {editingReel ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
