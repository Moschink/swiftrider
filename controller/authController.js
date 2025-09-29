const userModel = require("../schema/user");
// const otpModel = require("../schema/otp");
// const generateOTP = require("../utility/generateOTP");
const bcrypt = require("bcrypt");
// const smtp = require("../utility/sendEmail");
// const {v4} = require("uuid");
const jsonWebToken = require("jsonwebtoken");
require("dotenv").config();
async function register(req, res) {
    const {
        fullName, email, password, role
    } = req.body;
    // validate role manually (optional)
    if (!["rider", "admin", "customer"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const emailExists = await userModel.findOne({email});

    if(emailExists) {
        res.status(409).send({
            message: "Email already exist"
        });
        return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await userModel.create({
        fullName, email, password: hashedPassword, role
    });

    // const otp = generateOTP();

    // const generateOTPToken = v4();

    // await otpModel.create({
    //     userId: newUser._id, purpose: "verify-email"
    // });

    // await smtp.sendMail({
    //     from: process.env.EMAIL_USERNAME,
    //     to: email,
    //     subject: "Company Name - Verify Email",
    //     html: `
    //         <div>
    //             <h1>Verify email</h1>
    //             <div>Your otp is: ${otp}</div>
    //         </div>
    //     `
    // });

    res.status(201).send({
        message: "User created successfully!",
        newUser
        // otpToken: generateOTPToken, purpose: "verify-email"
    });
}

// async function verifyOTP(req, res) {
//     const {otp, otpToken, purpose} = req.body;

//     if(purpose != "verify-email") {
//         res.status(422).send({
//             message: "Invalid otp purpose"
//         });
//         return;
//     }

//     const otpDetails = await otpModel.findOne({otpToken, purpose});

//     if(!otpDetails) {
//         res.status(422).send({
//             message: "Invalid otp token"
//         });
//         return;
//     }

//     if(otp != otpDetails.otp) {
//         res.status(422).send({
//             message: "Invalid otp"
//         });
//         return;
//     }

//     await userModel.findByIdAndUpdate(otpDetails.userId, {
//         isEmailVerified: true
//     });

//     await otpModel.deleteMany({userId: otpDetails.userId, purpose: "verify-email"});

//     res.send({
//         message: "User email verified successfully"
//     });

// }

async function login(req, res) {

    const {email, password} = req.body;

    const userDetail = await userModel.findOne({email});
    if(!userDetail) {
        res.status(404).send({
            message: "User not found"
        });
        return;
    }

    const passwordsMatch = bcrypt.compareSync(password, userDetail.password);

    if(!passwordsMatch) {
        res.status(400).send({
            message: "Invalid credentials"
        });
        return;
    }

    const token = jsonWebToken.sign({ownerId: userDetail.id, email: userDetail.email, role: userDetail.role}, process.env.JWT_KEY);

    res.send({
        message: "Login successful",
        userDetail: {
            fullName: userDetail.fullName,
            email: userDetail.email,
            role: userDetail.role
        },
        token
    });
}



module.exports = {
    register,
    // verifyOTP,
    login
}
