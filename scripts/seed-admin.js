const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Admin Schema
const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  permissions: {
    userManagement: { type: Boolean, default: true },
    doctorManagement: { type: Boolean, default: true },
    contentManagement: { type: Boolean, default: true },
    systemSettings: { type: Boolean, default: false },
    analytics: { type: Boolean, default: true }
  },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  department: { type: String, trim: true, default: 'Administration' },
  activityLog: [{ 
    action: String, 
    target: String, 
    targetId: String, 
    details: mongoose.Schema.Types.Mixed, 
    timestamp: { type: Date, default: Date.now },
    ipAddress: String 
  }]
}, { timestamps: true });

// Pre-save middleware to hash password
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

async function seedAdminUser() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gamingcloud795_db_user:Ywbo2Ud1aEmwu4P9@cluster0.sxphswv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@doctar.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@doctar.com');
      console.log('Use the existing password or update it in the database');
      return;
    }

    // Create admin user
    const adminUser = new Admin({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@doctar.com',
      password: 'admin123', // This will be hashed by the pre-save middleware
      role: 'super_admin',
      permissions: {
        userManagement: true,
        doctorManagement: true,
        contentManagement: true,
        systemSettings: true,
        analytics: true
      },
      isActive: true,
      isEmailVerified: true,
      department: 'System Administration'
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@doctar.com');
    console.log('🔑 Password: admin123');
    console.log('🚀 You can now login to the admin panel at /admin/login');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
seedAdminUser();