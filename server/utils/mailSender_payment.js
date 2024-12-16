const nodemailer = require("nodemailer");

const mailSender_payment = async (email, title, body, pa) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "MutaLearn",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
      attachments: [
        {
          filename: "invoice.pdf",
          path: pa,
          contentType: "application/pdf",
        },
      ],
    });
    console.log(info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = mailSender_payment;
