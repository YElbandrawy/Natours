const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const Tour = require(`${__dirname}/../../models/toursModel`);
const User = require(`${__dirname}/../../models/usersModel`);
const Review = require(`${__dirname}/../../models/reviewModel`);
//////////////////Connect DataBase//////////////////
const db_uri = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db_uri, { dbName: 'natours' }).then((con) => {
  console.log('DataBase onnection Established !');
});

//////////////////Read the DataFile//////////////////
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));
/***************************************************/
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data Imported successfuly!');
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};
const clearCollection = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('collection cleared');
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

console.log(process.argv);
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--clear') {
  clearCollection();
}
