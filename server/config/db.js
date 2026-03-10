const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri) {
      console.log('No MONGO_URI found, using in-memory MongoDB...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
