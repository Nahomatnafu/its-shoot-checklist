const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Shoot = require('../models/Shoot');
const ImageWaiver = require('../models/ImageWaiver');
const Credit = require('../models/Credit');
const User = require('../models/User');

async function checkRecords() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI not found in environment variables');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    // Get all users
    const users = await User.find();
    console.log('📋 Users in database:');
    users.forEach(user => {
      console.log(`  - ${user.name} (${user._id})`);
    });

    // Check Shoots
    console.log('\n📸 Shoots:');
    const shoots = await Shoot.find().populate('user', 'name email');
    console.log(`  Total: ${shoots.length}`);
    shoots.forEach(shoot => {
      console.log(`  - ${shoot.title} | User: ${shoot.user?.name || 'NO USER'} (${shoot.user?._id || 'null'}) | Raw user field: ${shoot.user}`);
    });

    // Check Waivers
    console.log('\n📑 Waivers:');
    const waivers = await ImageWaiver.find().populate('user', 'name email');
    console.log(`  Total: ${waivers.length}`);
    waivers.forEach(waiver => {
      console.log(`  - ${waiver.projectName || 'Untitled'} | User: ${waiver.user?.name || 'NO USER'} (${waiver.user?._id || 'null'})`);
    });

    // Check Credits
    console.log('\n🎬 Credits:');
    const credits = await Credit.find().populate('user', 'name email');
    console.log(`  Total: ${credits.length}`);
    credits.forEach(credit => {
      console.log(`  - ${credit.projectName} | User: ${credit.user?.name || 'NO USER'} (${credit.user?._id || 'null'})`);
    });

    console.log('\n✅ Check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Check failed:', error);
    process.exit(1);
  }
}

checkRecords();

