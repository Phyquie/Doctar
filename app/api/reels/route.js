import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Reels from '../../../models/Reels';
import Doctor from '../../../models/Doctor';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const category = searchParams.get('category') || '';
    const author = searchParams.get('author') || '';
    const featured = searchParams.get('featured') === 'true';
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (author) {
      query.author = author;
    }
    
    if (featured) {
      query.isFeatured = true;
    }
    
    // Get total count
    const totalItems = await Reels.countDocuments(query);
    
    // Get reels with pagination
    const reels = await Reels.find(query)
      .populate('author', 'firstName lastName email')
      .select('-__v')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPages = Math.ceil(totalItems / limit);
    
    return NextResponse.json({
      success: true,
      data: {
        reels,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching reels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reels' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, description, iframeUrl, thumbnail, location, category, duration, tags, author, isFeatured } = body;
    
    // Validate required fields
    if (!title || !description || !iframeUrl || !location || !category || !duration || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate iframe URL format
    if (!iframeUrl.includes('<iframe') || !iframeUrl.includes('</iframe>')) {
      return NextResponse.json(
        { error: 'Invalid iframe URL format' },
        { status: 400 }
      );
    }
    
    // Check if author exists
    const doctor = await Doctor.findById(author);
    if (!doctor) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }
    
    // Create new reel
    const newReel = new Reels({
      title,
      description,
      iframeUrl,
      thumbnail,
      location,
      category,
      duration,
      tags: tags || [],
      author,
      isFeatured: isFeatured || false
    });
    
    await newReel.save();
    
    // Populate author data
    await newReel.populate('author', 'firstName lastName email');
    
    return NextResponse.json({
      success: true,
      message: 'Reel created successfully',
      data: newReel
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating reel:', error);
    return NextResponse.json(
      { error: 'Failed to create reel' },
      { status: 500 }
    );
  }
}
