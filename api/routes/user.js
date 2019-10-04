const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const route = express.Router();

route.get("/", (req, res) => {
  User.find()
    .exec()
    .then(docs => {
      if (docs.length > 0) {
        res.status(200).json({
          count: docs.length,
          message: "List of users",
          users: docs.map(doc => {
            return {
              id: doc._id,
              name: doc.name,
              email: doc.email
            };
          })
        });
      } else {
        res.status(404).json({
          message: "No users found"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Error occured while process your request",
        error: error
      });
    });
});

route.get("/:userId", (req, res) => {
  let userId = req.params.userId;

  User.findOne({ _id: userId })
    .exec()
    .then(doc => {
      if (doc != null) {
        res.status(200).json({
          message: "user list",
          user: {
            id: doc._id,
            name: doc.name,
            email: doc.email
          }
        });
      } else {
        res.status(404).json({
          message: "User not found for the user id " + userId,
          user: doc
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Error occured while processing your request",
        error: error
      });
    });
});

route.post("/", (req, res) => {
  const user = new User();

  var plainText = req.body.password;
  user.hashPassword(plainText, function(hash, salt, err) {
    if (!err) {
      user._id = new mongoose.Types.ObjectId();
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = hash;
      user.passwordSalt = salt;

      user
        .save()
        .then(result => {
          res.status(201).json({
            message: "User is created successfully"
          });
        })
        .catch(error => {
          res.status(500).json({
            message: "Error occured in the server",
            error: error
          });
        });
    } else {
      res.status(500).json({
        message: "Error occured in the server",
        error: err
      });
    }
  });
});

route.post("/checkuser", (req, res) => {
  var plainText = req.body.password;
  var email = req.body.email;

  if (email == "irulandi@hnsonline.com" && plainText == "nano") {
    res.status(200).json({
      message: "Is Valid",
      isAuthenticated: true
    });
  } else {
    res.status(404).json({
      message: "Not Valid",
      isAuthenticated: false
    });
  }
  // User.findOne({ email: email }).exec()
  // .then(doc => {
  //     let encPassword = doc.password;
  //     bcrypt.compare(plainText, encPassword, (err, result) => {
  //         if (!err){
  //             res.status(200).json({
  //                 message: 'Username is valid',
  //                 isAuthenticated: result, // result will be boolean value
  //                 result: result
  //             });
  //         }else{
  //             res.status(500).json({
  //                 message: 'User is not valid',
  //                 isAuthenticated: result,
  //                 error: err
  //             });
  //         }
  //     });
  // })
  // .catch(err => {
  //     res.status(500).json({
  //         message: 'Error occured in the server side',
  //         error: err
  //     });
  // });
});

route.patch("/:userId", (req, res) => {
  const updateObject = req.body;
  const userId = req.params.userId;

  User.update({ _id: userId }, { $set: updateObject }, { new: true })
    .exec()
    .then(result => {
      if (result.nModified > 0) {
        res.status(201).json({
          message: "User is updated successfully"
        });
      } else {
        res.status(201).json({
          message: "User is not updated"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Error occured while processing your request",
        error: error
      });
    });
});

route.delete("/:userId", (req, res) => {
  const userId = req.params.userId;
  User.deleteOne({ _id: userId })
    .exec()
    .then(result => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: "User is deleted successfully"
        });
      } else {
        res.status(404).json({
          message: "User is not updated"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Error occured while processing your request",
        error: error
      });
    });
});

module.exports = route;
