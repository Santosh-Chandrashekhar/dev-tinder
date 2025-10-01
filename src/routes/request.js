const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Connection = require("../models/connection");
const User = require("../models/user");

const requestRouter = express.Router();

// send connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // If toUserId present in table or not
      const toUser = await User.findById(toUserId);

      if (!toUser) {
        res.status(404).send("User not found");
      }

      //Status Validation
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Not a valid status");
      }

      // Is thr any existing connection present
      const existingConnections = await Connection.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnections) {
        throw new Error("Connection aleready Exits!");
      }

      const connectionRequest = new Connection({
        fromUserId,
        toUserId,
        status,
      });

      const newConenction = await connectionRequest.save();
      res.json({ message: "Connection sent/ignored", data: newConenction });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

//accept or reject connection request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      // validate the status
      // logged in user should be toUser
      // status should be interested

      const isStatusAllowed = ["accepted", "rejected"].includes(status);
      if (!isStatusAllowed) {
        res.status(400).json({ message: "Not a valid status" });
      }

      const connectionRequest = await Connection.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        res.status(404).json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      const updatedConnectionRequest = await connectionRequest.save();
      res.json({
        message: `Connection is ${status}`,
        data: updatedConnectionRequest,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

//get all the received connection requests
requestRouter.get("/user/requests/received", userAuth, async (req, res) => {
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

requestRouter.get("/user/connections", userAuth, async (req, res) => {
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

module.exports = requestRouter;
