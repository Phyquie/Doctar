import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import Doctor from '../../../../../models/Doctor';
import Admin from '../../../../../models/Admin';
import jwt from 'jsonwebtoken';

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const { queryType, value, reason } = await request.json();
    
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
        { error: 'Doctor ID is required' },
        { status: 400 }
      );
    }
    
    if (!queryType || (value !== true && value !== false)) {
      return NextResponse.json(
        { error: 'Query type and boolean value are required' },
        { status: 400 }
      );
    }
    
    if (!['approval', 'suspension'].includes(queryType)) {
      return NextResponse.json(
        { error: 'Query type must be either "approval" or "suspension"' },
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
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }
    
    // Check if admin account is active
    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Admin account is deactivated' },
        { status: 403 }
      );
    }
    
    // Find the doctor
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Prepare update object based on query type
    let updateObject = {};
    let actionMessage = '';
    
    if (queryType === 'approval') {
      updateObject.isAdminVerified = value;
      actionMessage = value ? 'approved' : 'disapproved';
      
      // If disapproving, you might want to deactivate the doctor
      if (!value) {
        updateObject.isActive = false;
      } else {
        // If approving, activate the doctor (unless suspended)
        if (!doctor.isSuspended) {
          updateObject.isActive = true;
        }
      }
    } else if (queryType === 'suspension') {
      updateObject.isSuspended = value;
      actionMessage = value ? 'suspended' : 'unsuspended';
      
      // If suspending, add reason and deactivate
      if (value) {
        if (reason) {
          updateObject.suspensionReason = reason;
        }
        updateObject.isActive = false;
      } else {
        // If unsuspending, clear reason and activate (if approved)
        updateObject.suspensionReason = '';
        if (doctor.isAdminVerified) {
          updateObject.isActive = true;
        }
      }
    }
    
    // Update the doctor
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: updateObject },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from response
    
    // Log the admin action (you might want to create an audit log)
    console.log(`Admin ${admin.email} ${actionMessage} doctor ${doctor.email} (ID: ${id})`);
    
    return NextResponse.json({
      success: true,
      message: `Doctor ${actionMessage} successfully`,
      data: {
        doctor: {
          id: updatedDoctor._id,
          firstName: updatedDoctor.firstName,
          lastName: updatedDoctor.lastName,
          email: updatedDoctor.email,
          specialization: updatedDoctor.specialization,
          isAdminVerified: updatedDoctor.isAdminVerified,
          isSuspended: updatedDoctor.isSuspended,
          suspensionReason: updatedDoctor.suspensionReason,
          isActive: updatedDoctor.isActive,
          isEmailVerified: updatedDoctor.isEmailVerified,
          isPhoneVerified: updatedDoctor.isPhoneVerified
        },
        action: {
          type: queryType,
          value: value,
          reason: reason || null,
          performedBy: {
            adminId: admin._id,
            adminEmail: admin.email,
            adminName: `${admin.firstName} ${admin.lastName}`
          },
          timestamp: new Date()
        }
      }
    });
    
  } catch (error) {
    console.error('Doctor status update error:', error);
    return NextResponse.json(
      { error: 'Failed to update doctor status. Please try again.' },
      { status: 500 }
    );
  }
}

// GET method to fetch specific doctor details for admin
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
        { error: 'Doctor ID is required' },
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
    
    // Find the doctor
    const doctor = await Doctor.findById(id).select('-password');
    
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Doctor details fetched successfully',
      data: {
        doctor
      }
    });
    
  } catch (error) {
    console.error('Fetch doctor error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctor details. Please try again.' },
      { status: 500 }
    );
  }
}

// DELETE method to delete a doctor
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
        { error: 'Doctor ID is required' },
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
    
    // Find the doctor
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    // Delete the doctor
    await Doctor.findByIdAndDelete(id);
    
    // Log the admin action
    console.log(`Admin ${admin.email} deleted doctor ${doctor.email} (ID: ${id})`);
    
    return NextResponse.json({
      success: true,
      message: 'Doctor deleted successfully',
      data: {
        deletedDoctor: {
          id: doctor._id,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          email: doctor.email
        },
        action: {
          type: 'delete',
          performedBy: {
            adminId: admin._id,
            adminEmail: admin.email,
            adminName: `${admin.firstName} ${admin.lastName}`
          },
          timestamp: new Date()
        }
      }
    });
    
  } catch (error) {
    console.error('Delete doctor error:', error);
    return NextResponse.json(
      { error: 'Failed to delete doctor. Please try again.' },
      { status: 500 }
    );
  }
}
