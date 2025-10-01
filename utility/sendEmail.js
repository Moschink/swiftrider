const nodemailer = require("nodemailer");
require("dotenv").config();
// require("dotenv").config()

// const transport = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD
//     },
//     secure: true,
//     port: 465
// });

// module.exports = transport;

// const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,             // use TLS
  secure: false,         //  must be false for port 587
  auth: {
    user: process.env.EMAIL_USERNAME,      // your Gmail address
    pass: process.env.EMAIL_PASSWORD // app password (not normal Gmail password)
  },
  tls: {
    rejectUnauthorized: false            // optional: helps bypass some SSL issues
  }
});

module.exports = transporter;

