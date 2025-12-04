//C:\Users\samar\Desktop\GCS\NISHAT-new\BACKEND\src\models\RefreshToken.js
const mongoose = require("mongoose");
const config = require("../config/auth.config");
const { v4: uuidv4 } = require('uuid');

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: Date,
});


RefreshTokenSchema.statics.createToken = async function (user) {
  let expiredAt = new Date();
  // add jwtRefreshExpiration (in seconds)
  expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

  let _token = uuidv4();

  let _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt, // <-- store Date object
  });

  let refreshToken = await _object.save();
  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};


const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

module.exports = RefreshToken;
