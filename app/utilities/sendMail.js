import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "SMTP.oc.edu",
  port: 25,
  secure: false,
  debug: true,
  logger: true,
});

export async function sendMail(from, to, cc, subject, body) {
  const mailOptions = {
    from: from,
    to: to,
    cc: cc,
    subject: subject,
    text: body,
  };

  console.log(mailOptions);

  // return new Promise((resolve, reject) => {
  //   transporter.sendMail(mailOptions, (error, info) => {
  //     if (error) {
  //       console.error("Error sending email:", error);
  //       reject(error);
  //     } else {
  //       console.log("Email sent:", info.response);
  //       resolve(info);
  //     }
  //   });
  // });

  // For testing, just return success
  return { message: `${mailOptions}` };
}