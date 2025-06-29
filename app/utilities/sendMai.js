const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "SMTP.oc.edu",
  port: 25,
  secure: false,
  debug: true, // show debug output
  logger: true, // log information in console
});

const sendMail = (from, to, cc, subject, body) => {
  const mailOptions = {
    from: from,
    to: to,
    cc: cc,
    subject: subject,
    text: body,
  };

// Comment out below code block and console log

    console.log(mailOptions);

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log("Error: " + error);
//     } else {
//       console.log("Email sent: " + info.response);
//     }
//   });
};

module.exports = { sendMail };