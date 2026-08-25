import knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../knex.config.js';

const db = knex(knexConfig);

// Bind ALL Objection models to this Knex instance
Model.knex(db);

export default db;