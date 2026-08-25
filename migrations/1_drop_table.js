import knex from 'knex';
import db from '../knex.config.js';

function down(pg){
  return pg.schema.dropTable('users');
}
async function init(){
  try{
    const pg = knex(db);
    await down(pg);
    console.log('Database dropped successfully');
    process.kill(process.pid, 'SIGTERM');
  }catch(err){
    console.error('Error dropping database:', err);
  }
}
init(); 
