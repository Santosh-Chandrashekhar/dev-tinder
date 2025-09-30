const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Connection = require("../models/connection");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      console.log("toUSer", toUserId);
      // If toUserId present in table or not
      const toUser = await User.findById(toUserId);
      console.log("toUSer", toUser);
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

module.exports = requestRouter;
