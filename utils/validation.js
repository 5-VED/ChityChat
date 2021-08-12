const { check, validationResult } = require("express-validator");
const { ReE, ReS } = require("../utils/responseService");
const accepted_extensions = [".jpg", ".png", ".jpeg"];
const mime = ["image/jpg", "image/png", "image/jpeg"];
const path = require("path");

//Functin to validate users input
exports.validate = [
  check("name")
    .isString()
    .notEmpty()
    .withMessage("Username can not be empty")
    .bail() // can be used multiple times in the same validation chain if needed:\
    .isLength({ min: 3 })
    .withMessage("Enter name to Short, Minimum three characters required")
    .bail()
    .trim()
    .escape() // escape() will replace certain characters (i.e. <, >, /, &, ', ") with the corresponding HTML entity
    .bail(),

  check("email")
    .isEmail()
    .withMessage("invalid Email Address")
    .bail()
    .notEmpty()
    .withMessage("Please Enter Email Address")
    .trim()
    .escape()
    .normalizeEmail() //ensures the email address is in a safe and standard format.
    .bail(),

  check("password")
    .notEmpty()
    .withMessage("Password can not be empty!")
    .isLength({ min: 6 })
    .withMessage("Minimum 6 characters required!")
    .matches("[a-z]")
    .withMessage("Must contain a lowercase letter")
    .matches("[0-9]")
    .withMessage("Must contain a number")
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ReE(res, errors, 422);
    }
    next();
  },
];

//Method to validate a passsword while Resseting a password
exports.passwordValidate = [
  check("password")
    .notEmpty()
    .withMessage("Password can not be empty!")
    .isLength({ min: 6 })
    .withMessage("Minimum 6 characters required!")
    .matches("[a-zA-Z]")
    .withMessage("Must contain a lowercase and Upper Case letter")
    .matches("[0-9]")
    .withMessage("Must contain a number")
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ReE(res, errors, 422);
    }
    next();
  },
];

//Method to validate image file
module.exports.imageValidate = (req, res, next) => {
  console.log("in image validate file");
  // console.log(req.file)
  const extension = path.extname(req.file.originalname);
  for (i = 0; i < 3; i++) {
    if (accepted_extensions[i] === extension) {
      // console.log(accepted_extensions[i] !== extension);
      // console.log(extension);
      return next(); //console.log("Hello");
    }
  }
  return ReE(
    res,
    "The uploaded file is not in " +
      accepted_extensions.join(", ") +
      " format!",
    400
  );
};
