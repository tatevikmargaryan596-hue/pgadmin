import knex from 'knex';
import bcrypt from 'bcrypt';
import { Model } from 'objection';

async function seed(pg) { 

  await pg('users').insert([
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await bcrypt.hash('password123', 10)
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: await bcrypt.hash('janepassword', 10)
    },
    {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      password: await bcrypt.hash('alicepassword', 10)
    }
  ]);
}

async function init() {
  const pg = knex({
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'admin123',
      port: 5432,
      database: 'postgres'
    }
  });
  
  try {
    await seed(pg);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await pg.destroy();
  }
}

init();
