// NPM Modules
import mongoose from 'mongoose';
require('dotenv').config();

// Local Modules
import { LoggerUtil } from '../utils';

class MongoStorage {
  static async init() {
    try {
      const mongoUri = process.env.NODE_ENV === 'production'
        ? process.env.MONGO_URI_PROD
        : process.env.MONGO_URI_DEV || 'mongodb+srv://koryun468_db_user:jVQlggQclIxu2EIe@cluster0.b3tqqco.mongodb.net/';

      const connection = await mongoose.connect(mongoUri);

      // MongoStorage.connection = connection;

      LoggerUtil.info('MongoDB Connected successfully...');
    } catch (error) {
      LoggerUtil.error(`MongoDB connection error: ${error.message}`);
      process.exit(1);
    }
  }
}

export default MongoStorage;