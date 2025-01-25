const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "Database connected:",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1); // Exit the process if the DB connection fails
  }
};

module.exports = connectDB;
