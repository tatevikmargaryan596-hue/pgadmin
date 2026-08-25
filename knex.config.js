import Knex from 'knex';
import { Model } from 'objection';

const db = Knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'admin123',
    port: 5432,
    database: 'postgres'
  }
});

Model.knex(db);

export default db;