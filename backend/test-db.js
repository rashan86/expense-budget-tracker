require('./config/dnsFix');
require('dotenv').config();
const mongoose = require('mongoose');

async function testDatabaseConnection() {
  console.log('\n======================================================');
  console.log('       MONGODB DATABASE CONNECTION DIAGNOSTIC         ');
  console.log('======================================================\n');

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ ERROR: MONGODB_URI is not defined in backend/.env!');
    process.exit(1);
  }

  // Mask password for display
  const maskedUri = uri.replace(/:([^:@]{3,})@/, ':****@');
  console.log(`[1] Configuration Check:`);
  console.log(`    Target URI: ${maskedUri}`);
  console.log(`    PORT: ${process.env.PORT || 5000}`);
  console.log(`    NODE_ENV: ${process.env.NODE_ENV || 'development'}\n`);

  console.log('[2] Initiating Connection to MongoDB Atlas...');
  const startTime = Date.now();

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });

    const elapsed = Date.now() - startTime;
    console.log(`    ✅ Successfully Connected in ${elapsed}ms!\n`);

    console.log('[3] Cluster & Database Details:');
    console.log(`    Cluster Host:   ${mongoose.connection.host}`);
    console.log(`    Database Name:  ${mongoose.connection.name}`);
    console.log(`    Port:           ${mongoose.connection.port}`);
    console.log(`    Ready State:    ${mongoose.connection.readyState} (1 = Connected)\n`);

    console.log('[4] Running Ping Command:');
    const admin = mongoose.connection.db.admin();
    const pingRes = await admin.command({ ping: 1 });
    console.log(`    Ping Output:    ${JSON.stringify(pingRes)} (ok: 1)\n`);

    console.log('[5] Checking Existing Data:');
    const User = require('./models/User');
    const Transaction = require('./models/Transaction');
    const Budget = require('./models/Budget');

    const [userCount, txCount, budgetCount] = await Promise.all([
      User.countDocuments(),
      Transaction.countDocuments(),
      Budget.countDocuments(),
    ]);

    console.log(`    Users in DB:        ${userCount}`);
    console.log(`    Transactions in DB: ${txCount}`);
    console.log(`    Budgets in DB:      ${budgetCount}\n`);

    if (userCount > 0) {
      const demo = await User.findOne({ email: 'john@example.com' });
      if (demo) {
        console.log(`    Demo Account:   john@example.com is available`);
      }
    }

    console.log('======================================================');
    console.log('🎉 RESULT: DATABASE IS 100% CONNECTED AND WORKING!');
    console.log('======================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ FAILED TO CONNECT TO MONGODB:');
    console.error(`   Error Message: ${err.message}`);
    console.log('\nTroubleshooting Checklist:');
    console.log('  1. Check if IP Address 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.');
    console.log('  2. Verify your database username and password in backend/.env.');
    console.log('  3. Ensure your local internet / DNS is not blocking MongoDB SRV queries.\n');
    process.exit(1);
  }
}

testDatabaseConnection();
