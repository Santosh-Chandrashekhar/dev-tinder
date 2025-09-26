const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);

// User is the model name here: When we save the data to database it will store in users collection : how mongoose work here is
// it takes the plural lowercase value of model User --> users so the data will be stored in "users" collection

// const User =. mongoose.model("User", userSchema)
