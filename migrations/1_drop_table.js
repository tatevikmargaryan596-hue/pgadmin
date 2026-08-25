import knex from 'knex';
function down(pg){
  return pg.schema.dropTable('users');
}
async function init(){
  try{
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
    await down(pg);
    console.log('Database dropped successfully');
    process.kill(process.pid, 'SIGTERM');
  }catch(err){
    console.error('Error dropping database:', err);
  }
}
init(); 
