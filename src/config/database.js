const mongoose = require("mongoose");

const REMOTE_URI =
  "mongodb+srv://santosh:I2X6kqjOzlqgWr4a@dev-cluster.uc4geaf.mongodb.net/santosh?retryWrites=true&w=majority&appName=dev-cluster";
const connectDB = async () => {
  await mongoose.connect(REMOTE_URI);
};

module.exports = { connectDB };
