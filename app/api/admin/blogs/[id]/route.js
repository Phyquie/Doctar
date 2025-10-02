import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import Blog from '../../../../../models/blogsModel';
import Admin from '../../../../../models/Admin';
import jwt from 'jsonwebtoken';

// GET method - Fetch single blog by ID
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
        { error: 'Blog ID is required' },
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
    
    // Find the blog by ID
    const blog = await Blog.findById(id).populate('author', 'firstName lastName email specialization');
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog fetched successfully',
      data: {
        blog
      }
    });
    
  } catch (error) {
    console.error('Fetch blog error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog. Please try again.' },
      { status: 500 }
    );
  }
}

// PUT method - Update/Edit blog by ID
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
        { error: 'Blog ID is required' },
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
    
    // Find the blog first
    const existingBlog = await Blog.findById(id);
    
    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
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
    
    // Update the blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('author', 'firstName lastName email specialization');
    
    // Log the admin action
    console.log(`Admin ${admin.email} updated blog: ${updatedBlog.heading} (ID: ${id})`);
    
    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      data: {
        blog: updatedBlog
      }
    });
    
  } catch (error) {
    console.error('Update blog error:', error);
    
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return NextResponse.json(
        { error: 'A blog with similar heading already exists' },
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
      { error: 'Failed to update blog. Please try again.' },
      { status: 500 }
    );
  }
}

// DELETE method - Delete blog by ID
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
        { error: 'Blog ID is required' },
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
    
    // Find and delete the blog
    const deletedBlog = await Blog.findByIdAndDelete(id);
    
    if (!deletedBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Log the admin action
    console.log(`Admin ${admin.email} deleted blog: ${deletedBlog.heading} (ID: ${id})`);
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
      data: {
        deletedBlog: {
          id: deletedBlog._id,
          heading: deletedBlog.heading,
          slug: deletedBlog.slug
        }
      }
    });
    
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog. Please try again.' },
      { status: 500 }
    );
  }
}