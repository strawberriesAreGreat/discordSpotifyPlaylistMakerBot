import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log('Attempting to connect to database...');
try {
  sequelize.authenticate();
  sequelize.sync();
  console.log('Connection has been established successfully.');
} catch (err) {
  console.log('Unable to connect to the database:');
  console.log(err);
}
