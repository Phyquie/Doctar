import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import News from '../../../../models/newsModel';
import Admin from '../../../../models/Admin';
import jwt from 'jsonwebtoken';

// GET method - Fetch all news with pagination
export async function GET(request) {
  try {
    await connectDB();
    
    // Get token from headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : request.headers.get('token');
    
    // Validate required fields
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }
    
    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'doctar_jwt_secret_key_2025');
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Check if user role is admin
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }
    
    // Verify admin exists in database
    const admin = await Admin.findById(decoded.userId);
    
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: 'Admin not found or deactivated' },
        { status: 404 }
      );
    }
    
    // Get pagination parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const search = url.searchParams.get('search') || '';
    
    // Build query object
    const query = {};
    
    // Add search functionality
    if (search) {
      query.$or = [
        { heading: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Fetch news with pagination and populate author
    const news = await News.find(query)
      .populate('author', 'firstName lastName email specialization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalNews = await News.countDocuments(query);
    const totalPages = Math.ceil(totalNews / limit);
    
    // Return news data
    return NextResponse.json({
      success: true,
      message: 'News fetched successfully',
      data: {
        news,
        pagination: {
          currentPage: page,
          totalPages,
          totalNews,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Fetch news error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news. Please try again.' },
      { status: 500 }
    );
  }
}

// POST method - Create a new news article
export async function POST(request) {
  try {
    await connectDB();
    
    // Get token from headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : request.headers.get('token');
    
    // Validate required fields
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }
    
    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'doctar_jwt_secret_key_2025');
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Check if user role is admin
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }
    
    // Verify admin exists in database
    const admin = await Admin.findById(decoded.userId);
    
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: 'Admin not found or deactivated' },
        { status: 404 }
      );
    }
    
    // Get news data from request body
    const { heading, description, images, author } = await request.json();
    
    // Validate required fields
    if (!heading || !description || !images || !author) {
      return NextResponse.json(
        { error: 'All fields are required: heading, description, images, author' },
        { status: 400 }
      );
    }
    
    // Validate images array
    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }
    
    // Create new news article
    const newNews = new News({
      heading: heading.trim(),
      description: description.trim(),
      images,
      author
    });
    
    // Save the news (slug will be auto-generated by pre-save middleware)
    const savedNews = await newNews.save();
    
    // Populate author information
    await savedNews.populate('author', 'firstName lastName email specialization');
    
    // Log the admin action
    console.log(`Admin ${admin.email} created news: ${savedNews.heading} (ID: ${savedNews._id})`);
    
    return NextResponse.json({
      success: true,
      message: 'News created successfully',
      data: {
        news: savedNews
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create news error:', error);
    
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return NextResponse.json(
        { error: 'A news article with similar heading already exists' },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create news. Please try again.' },
      { status: 500 }
    );
  }
}
