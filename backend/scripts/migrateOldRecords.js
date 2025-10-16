const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Shoot = require('../models/Shoot');
const ImageWaiver = require('../models/ImageWaiver');
const Credit = require('../models/Credit');
const User = require('../models/User');

async function migrateOldRecords() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Get the first admin or any user to assign to old records
    let defaultUser = await User.findOne({ role: 'admin' });
    
    if (!defaultUser) {
      defaultUser = await User.findOne();
    }

    if (!defaultUser) {
      console.log('No users found in database. Please create a user first.');
      process.exit(1);
    }

    console.log(`Using user: ${defaultUser.name} (${defaultUser._id})`);

    // Migrate Shoots
    const shootsResult = await Shoot.updateMany(
      { user: { $exists: false } },
      { $set: { user: defaultUser._id } }
    );
    console.log(`✅ Updated ${shootsResult.modifiedCount} shoots without user`);

    // Migrate Waivers
    const waiversResult = await ImageWaiver.updateMany(
      { user: { $exists: false } },
      { $set: { user: defaultUser._id } }
    );
    console.log(`✅ Updated ${waiversResult.modifiedCount} waivers without user`);

    // Migrate Credits
    const creditsResult = await Credit.updateMany(
      { user: { $exists: false } },
      { $set: { user: defaultUser._id } }
    );
    console.log(`✅ Updated ${creditsResult.modifiedCount} credits without user`);

    console.log('\n✅ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateOldRecords();

