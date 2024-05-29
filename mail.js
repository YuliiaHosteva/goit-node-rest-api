import "dotenv/config";
import nodemailer from "nodemailer";
import HttpError from "./helpers/HttpError.js";

const {
  MAILTRAP_USERNAME,
  MAILTRAP_PASSWORD,
  MAILTRAP_OWNER_EMAIL,
  BASE_URL,
} = process.env;

if (!MAILTRAP_USERNAME || !MAILTRAP_PASSWORD || !MAILTRAP_OWNER_EMAIL || !BASE_URL) {
  throw HttpError(500, "Missing required environment variables");
}

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: MAILTRAP_USERNAME,
    pass: MAILTRAP_PASSWORD,
  },
});

const sendVerificationMail = async ({ to, verificationToken }, next) => {
  try {
    await transport.sendMail({
      to,
      from: MAILTRAP_OWNER_EMAIL,
      subject: "Please verify your email address",
      html: `
        <h1>Please verify your email address</h1>
        <h2>Welcome!</h2> 
        <p>Thank you for registering on our site. To complete the registration process, please verify your email address by clicking the link below:</p> 
      
         <a href="${BASE_URL}/users/verify/${verificationToken}">
          Verify your email address</a>
        <p>If you did not register on our site, please ignore this email.</p>
        <p>Thank you for using our service!
        <br>Best regards,</p>`,
      text: `
        Please verify your email address
        Welcome! 
        Thank you for registering on our site. To complete the registration process, 
        please verify your email address by clicking the link below:
        ${BASE_URL}/users/verify/${verificationToken}
        If you did not register on our site, please ignore this email.
        Thank you for using our service!
        Best regards,`,
    });
  } catch (error) {
    next(error);
  }
};

export { sendVerificationMail };
