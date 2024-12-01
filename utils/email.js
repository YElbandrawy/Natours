const nodemailer = require('nodemailer');
const { MailtrapTransport } = require('mailtrap');

const sendEmail = async (options) => {
  const TOKEN = process.env.EMAIL_TOKEN;

  const transport = await nodemailer.createTransport(
    MailtrapTransport({
      token: TOKEN,
      testInboxId: 3282889,
    })
  );
  console.log('craeted transporter');
  console.log('now sending the email');

  //options arg is an object
  //{
  //to:''
  //subject:''
  //message:""
  //}
  const mailOptions = {
    from: process.env.SENDEREMAIL,
    to: options.to,
    subject: options.subject,
    text: options.message,
    category: 'Integration Test',
    sandbox: true,
  };

  await transport.sendMail(mailOptions);
};
module.exports = sendEmail;
