// const nodemailer = require("nodemailer");
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

// utility/sendEmail.js
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!to) {
      throw new Error("Missing recipient email (`to`)");
    }

    const msg = {
      to,
      from: process.env.SENDER_EMAIL, 
      subject,
      html,
    };

    await sgMail.send(msg);
    console.log(` Email sent to ${to}`);
  } catch (error) {
    console.error(" Email send error:", error.response?.body || error.message);
  }
};

module.exports = sendEmail;
