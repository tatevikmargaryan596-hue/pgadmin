import knex from 'knex';
function up(pg){
  return pg.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamps(true, true);
  });
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
    await up(pg);
    console.log('Database initialized successfully');
    process.kill(process.pid, 'SIGTERM');
  }catch(err){
    console.error('Error initializing database:', err);
  }
}
init();