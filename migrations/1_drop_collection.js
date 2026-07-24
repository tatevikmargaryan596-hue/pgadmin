// NPM Modules
import mongoose from 'mongoose';
require('dotenv').config();
// Local Modules
import { LoggerUtil } from '../src/utils';

const MONGO_URI = process.env.NODE_ENV === 'production'
  ? process.env.MONGO_URI_PROD
  : process.env.MONGO_URI_DEV || 'mongodb+srv://koryun468_db_user:jVQlggQclIxu2EIe@cluster0.b3tqqco.mongodb.net/';
console.log(MONGO_URI)
async function down() {
  await mongoose.connection.db.dropDatabase();
  console.log('Successfully dropped the database ...');
}

async function init() {
  try {
    await mongoose.connect(MONGO_URI);
    await down();
    
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    LoggerUtil.error(error.message);
    process.exit(1);
  }
}

init();