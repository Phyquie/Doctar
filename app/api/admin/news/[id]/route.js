import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import News from '../../../../../models/newsModel';
import Admin from '../../../../../models/Admin';
import jwt from 'jsonwebtoken';

// GET method - Fetch single news by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
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
    
    if (!id) {
      return NextResponse.json(
        { error: 'News ID is required' },
        { status: 400 }
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
    
    // Find the news by ID
    const news = await News.findById(id).populate('author', 'firstName lastName email specialization');
    
    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'News fetched successfully',
      data: {
        news
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

// PUT method - Update/Edit news by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
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
    
    if (!id) {
      return NextResponse.json(
        { error: 'News ID is required' },
        { status: 400 }
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
    
    // Find the news first
    const existingNews = await News.findById(id);
    
    if (!existingNews) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }
    
    // Get update data from request body
    const { heading, description, images, author } = await request.json();
    
    // Build update object with only provided fields
    const updateData = {};
    
    if (heading !== undefined) {
      updateData.heading = heading.trim();
    }
    
    if (description !== undefined) {
      updateData.description = description.trim();
    }
    
    if (images !== undefined) {
      if (!Array.isArray(images) || images.length === 0) {
        return NextResponse.json(
          { error: 'At least one image is required' },
          { status: 400 }
        );
      }
      updateData.images = images;
    }
    
    if (author !== undefined) {
      updateData.author = author;
    }
    
    // Update the news
    const updatedNews = await News.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('author', 'firstName lastName email specialization');
    
    // Log the admin action
    console.log(`Admin ${admin.email} updated news: ${updatedNews.heading} (ID: ${id})`);
    
    return NextResponse.json({
      success: true,
      message: 'News updated successfully',
      data: {
        news: updatedNews
      }
    });
    
  } catch (error) {
    console.error('Update news error:', error);
    
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
      { error: 'Failed to update news. Please try again.' },
      { status: 500 }
    );
  }
}

// DELETE method - Delete news by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
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
    
    if (!id) {
      return NextResponse.json(
        { error: 'News ID is required' },
        { status: 400 }
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
    
    // Find and delete the news
    const deletedNews = await News.findByIdAndDelete(id);
    
    if (!deletedNews) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }
    
    // Log the admin action
    console.log(`Admin ${admin.email} deleted news: ${deletedNews.heading} (ID: ${id})`);
    
    return NextResponse.json({
      success: true,
      message: 'News deleted successfully',
      data: {
        deletedNews: {
          id: deletedNews._id,
          heading: deletedNews.heading,
          slug: deletedNews.slug
        }
      }
    });
    
  } catch (error) {
    console.error('Delete news error:', error);
    return NextResponse.json(
      { error: 'Failed to delete news. Please try again.' },
      { status: 500 }
    );
  }
}