import knex from 'knex';
import db from '../knex.config.js';

function up(pg) {
  return pg.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').nullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('role').notNullable().defaultTo('user');
    table.timestamps(true, true);
  });
}

async function init() {
  try {
    const pg = knex(db);
    await up(pg);
    console.log('Database initialized successfully');
    process.kill(process.pid, 'SIGTERM');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

init();