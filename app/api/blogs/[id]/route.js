import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Blog from '../../../../models/blogsModel';

// GET /api/blogs/[id] - Get single blog
export async function GET(request, { params }) {
  try {
    await connectDB();

    const blog = await Blog.findById(params.id)
      .populate('author', 'firstName lastName email');

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id] - Update blog
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const body = await request.json();
    const { heading, description, images } = body;

    const blog = await Blog.findById(params.id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (heading) blog.heading = heading;
    if (description) blog.description = description;
    if (images) blog.images = images;

    await blog.save();
    await blog.populate('author', 'firstName lastName email');

    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });

  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] - Delete blog
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const blog = await Blog.findById(params.id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    await Blog.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
