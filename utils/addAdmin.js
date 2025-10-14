const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config();

const addAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Admin data
    const adminData = {
      name: 'Admin User',
      email: 'admin@exam.com',
      phone: '+1234567890',
      userType: 'Admin',
      username: 'admin',
      password: 'admin123',
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📌 Admin Details:');
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Password: admin123 (unchanged)\n`);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create(adminData);
    
    console.log('\n✨ Admin user created successfully!');
    console.log('\n📌 Login Credentials:');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Password: admin123`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addAdmin();

