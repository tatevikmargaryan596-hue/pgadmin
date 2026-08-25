import knex from 'knex';
import bcrypt from 'bcryptjs';
import dbConfig from '../knex.config.js';

const pg = knex(dbConfig);

async function seed() {
  try {
    // Check if user already exists
    const existing = await pg('users').where('email', 'john.doe@example.com').first();
    
    if (existing) {
      console.log('User already exists, skipping seed');
      process.exit(0);
    }

    const hashedPassword = bcrypt.hashSync('password123', 10);

    await pg('users').insert({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      role: 'user'
    });

    console.log('✅ User seeded successfully');
    console.log('Email: john.doe@example.com');
    console.log('Password: password123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();