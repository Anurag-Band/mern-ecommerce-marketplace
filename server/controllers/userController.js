const User = require("../models/userModel");
const BigPromise = require("../middlewares/BigPromise");
const CustomError = require("../utils/customError");
const CookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const emailHelper = require("../utils/emailHelper");
const crypto = require("crypto");

exports.signup = BigPromise(async (req, res, next) => {
  if (!req.body.photo) {
    return next(new CustomError("Photo is required for Signup!!!"));
  }

  const { name, email, password, photo } = req.body;

  if (!name || !name || !password) {
    return next(new CustomError("All Fields are Mandatory!!!", 400));
  }

  const isUserAlreadyExist = await User.findOne({ email });

  if (isUserAlreadyExist) {
    return next(
      new CustomError("Email is Already Registered, Please Login!", 400)
    );
  }

  const result = await cloudinary.v2.uploader.upload(photo, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      public_id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  CookieToken(user, 201, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError("All Fields are Mandatory!!!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CustomError("User Not Found, Please Register!!!", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(
      new CustomError("Email or Password is Not Exist or Matching!!!", 400)
    );
  }

  CookieToken(user, 200, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User is Logged Out Successfully!!!",
  });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new CustomError("User does not Existes, Please Register!!!", 401)
    );
  }

  const forgotToken = await user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const myUrl = `${req.protocol}://localhost:3770/auth/password/reset/${forgotToken}`;

  const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl} \n\n If you have not requested this email then, please ignore it.`;

  try {
    await emailHelper({
      toEmail: user.email,
      subject: "DEV Ecommerce Store - Password Reset Email",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Verification Link sent to your Email Successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new CustomError(error.message, 500));
  }
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encryptToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    encryptToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Token is Invalid or Expired!!!", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomError("password and confirm password do not match!!!", 400)
    );
  }

  user.password = req.body.password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  CookieToken(user, 200, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = BigPromise(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("+password");

  const isOldPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isOldPasswordMatched) {
    return next(new CustomError("Old Password is not Correct!!!", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new CustomError("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  CookieToken(user, 201, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
  const { name, email, photo } = req.body;
  if (!name || !email) {
    return next(new CustomError("Email and Password are Required!!!"));
  }
  const newData = {
    name,
    email,
  };

  if (req.body.photo) {
    const user = await User.findById(req.user.id);

    const imageId = user.photo.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const result = await cloudinary.v2.uploader.upload(photo, {
      folder: "users",
      width: 150,
      crop: "scale",
    });

    newData.photo = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

exports.adminGetOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new CustomError(`User does not exist with Id: ${req.params.id}`, 401)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminUpdateOneUserDetails = BigPromise(async (req, res, next) => {
  const { name, email, role } = req.body;

  const newData = {
    name,
    email,
    role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminDeleteOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new CustomError("No Such User Found!!!"), 401);
  }

  const imageId = user.photo.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    succes: true,
    message: "User Deleted Successfully!!!",
  });
});

exports.managerAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({ role: "user" });

  res.status(200).json({
    success: true,
    users,
  });
});
