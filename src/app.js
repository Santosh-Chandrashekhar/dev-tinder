const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.use("/signup", async (req, res) => {
  //console.log(req.body);
  // new instance of User model
  const userInput = req.body;
  const user = new User(userInput);
  try {
    await user.save();
    res.send("Data saved successfully!!!!");
  } catch (err) {
    res.status(400).send("Error while saving the data" + err.message);
  }
});

// fetch user by emailId
app.get("/user", async (req, res) => {
  //const email = req.body.emailId;
  const id = req.body._id;
  try {
    //const user = await User.findOne({ emailId: email });
    const user = await User.findById({ _id: id });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Fetch all users from db
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length) {
      res.send(users);
    } else {
      res.status(404).send("Users not found");
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Update the user record in db
app.patch("/user", async (req, res) => {
  const updatingData = req.body;
  try {
    const updatedRecord = await User.findByIdAndUpdate(
      updatingData.userId,
      updatingData,
      {
        returnDocument: "after",
      }
    );
    if (updatedRecord) {
      res.send(updatedRecord);
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});

// Delete a record from db
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    res.send("User Deleted successfully" + deletedUser);
  } catch (error) {
    res.status(400).send("Something wend wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection establised");
    app.listen(7070, () => {
      console.log("Server started succesfully!!!");
    });
  })
  .catch((err) => {
    console.log("Error in connecting to database", err);
  });
