const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcryptjs = require("bcryptjs");
const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  email: String,
  loginHistory: [{ dateTime: Date, userAgent: String }],
});
let User;
module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(
      "mongodb+srv://user:user@cluster0.pimpk50.mongodb.net/?retryWrites=true&w=majority"
    );

    db.on("error", (err) => {
      reject(err); // reject the promise with the provided error
    });
    db.once("open", () => {
      User = db.model("users", userSchema);
      console.log(
        "model userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr created"
      );
      resolve();
    });
  });
};
module.exports.registerUser = function (userData) {
  return new Promise((resolve, reject) => {
    if (userData.password != userData.password2) {
      reject("Passwords do not match!");
    } else {
      bcryptjs
        .hash(userData.password, 10)
        .then((hash) => {
          userData.password = hash;
          let newUser = new User(userData);
          newUser.save((err) => {
            if (err) {
              if (err.code == 11000) {
                reject("Username Taken");
              } else {
                reject("Error: " + err);
              }
            } else {
              console.log("success");
              resolve();
            }
          });
        })
        .catch((error) => {
          reject("Errorwith password encryption: " + error);
        });
    }
  });
};

module.exports.checkUser = function (userData) {
  return new Promise((resolve, reject) => {
    User.findOne({ username: userData.username })
      .exec()
      .then((user) => {
        if (!user) {
          reject("UNABLE TO FIND USER: " + userData.username);
        } else {
          bcryptjs
            .compare(userData.password, user.password)
            .then((result) => {
              if (result === true) {
                console.log(user);
                user.loginHistory.push({
                  dateTime: new Date(),
                  userAgent: userData.userAgent,
                });

                User.updateOne(
                  { username: user.username },
                  { $set: { loginHistory: user.loginHistory } }
                )
                  .exec()
                  .then(() => {
                    resolve(user);
                  })
                  .catch((err) => {
                    reject("ERROR UPDATING USER'S LOGIN HISTORY!");
                  });
              } else {
                reject("PASSWORD WAS INCORRECT!");
              }
            })
            .catch((error) => {
              reject("UNABLE TO DECRYPT PASSWORD!");
            });
        }
      });
  });
};
