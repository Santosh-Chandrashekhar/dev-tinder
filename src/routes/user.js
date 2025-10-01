const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const Connection = require("../models/connection");
const User = require("../models/user");

//get all the received connection requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  //toUser id should be login user id
  // status should be interested
  try {
    const loggedInUser = req.user;
    const data = await Connection.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    if (!data) {
      throw new Error("No connection requests found");
    }
    res.json({ message: "Received conection request", data });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  // get the connections accepted
  // loggedId user either toUserId or fromUserId
  try {
    const loggedInUser = req.user;
    const data = await Connection.find({
      $or: [
        { status: "accepted", fromUserId: loggedInUser._id },
        { status: "accepted", toUserId: loggedInUser._id },
      ],
    })
      .populate("fromUserId", "firstName lastName age gender")
      .populate("toUserId", "firstName lastName age gender");

    const connectionsList = data.map((each) => {
      if (each.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return each.toUserId;
      }
      return each.fromUserId;
    });

    // const response = connectionsList.map((each) => {
    //   return {
    //     id: each._id,
    //     firstName: each.firstName,
    //     lasrName: each.lastName,
    //   };
    // });
    console.log(data);
    if (!connectionsList) {
      res.json({ message: "No Connections found", data: [] });
    }
    res.json({ message: "Connections", connectionsList });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { page, limit } = req.query;
    var skip = parseInt(page) || 1;
    var limitCount = parseInt(limit) || 10;
    limitCount = limitCount > 50 ? 50 : limitCount;

    const connections = await Connection.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const idsToExclude = [];
    connections.forEach((each) => {
      idsToExclude.push(each.fromUserId);
      idsToExclude.push(each.toUserId);
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(idsToExclude) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName age gender skills")
      .skip(skip)
      .limit(limitCount);

    res.send(feedUsers);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = userRouter;
