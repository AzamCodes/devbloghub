import nodemailer from "nodemailer";
import User from "@/models/UserModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // console.log(email);
    // console.log(emailType);
    // console.log(userId);
    // create a hased token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    var transport = nodemailer.createTransport({
      service: "gmail",

      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.auth_user,
        pass: process.env.auth_pass,
      },
    });

    const mailOptions = {
      from: process.env.auth_user,
      to: [email],
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html:
        emailType === "VERIFY"
          ? `<p>Thank you for signing up for DEVLOCK! <br>To unlock all the features and benefits, please verify your email address.<br> Verifying your email ensures you receive important updates and offers.

Click the button below to verify your email <br>
<a href="${
              process.env.API_URL
            }/verifyemail?token=${hashedToken}">Verify Email</a> to ${
              emailType === "VERIFY"
                ? "verify your email"
                : "reset your password"
            }
            or copy and paste the link below in your browser. <br> ${
              process.env.API_URL
            }/verifyemail?token=${hashedToken}
            </p>`
          : `<p>We received a request to reset your password for your account on DEVLOCK. <br>If you requested this reset, please follow these steps to create a new password:<br>

1)Click the link below:<br>


<a href="${
              process.env.API_URL
            }/forgotPassword?token=${hashedToken}">RESET PASSWORD</a> to ${
              emailType === "RESET"
                ? "RESET YOUR PASSWORD"
                : "Verify Your Email"
            }<br>
2)Enter your new password and confirm it by entering it again.<br>3)Click "Reset Password."<br>
            If you didn't request a password reset, you can safely ignore this email. For your security, we recommend you don't share this link with anyone.
To ensure the security of your account, please choose a strong password that is unique to this account and not used for any other online services.<br>This link will expire in 24 hours. If you don't reset your password within 24 hours, you will need to request a new reset link<br>Thanks,<br>
            or copy and paste the link below in your browser. <br> ${
              process.env.API_URL
            }/forgotPassword?token=${hashedToken}
            </p>`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    // console.log(mailresponse);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
