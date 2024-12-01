const mongoose = require('mongoose');
const dotenv = require('dotenv');

//////////////////handle uncaught exeptions//////////////////
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
//////////////////start the amain app//////////////////
dotenv.config({ path: './config.env' });
const app = require('./app');

//////////////////Connect DataBase//////////////////
const db_uri = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db_uri, { dbName: 'natours' }).then((con) => {
  console.log('DataBase connection Established !');
});

//////////////////Start the server//////////////////
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`the server is up and running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
