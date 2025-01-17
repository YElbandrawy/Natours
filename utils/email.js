const pug = require('pug');
const htmlToText = require('html-to-text');
const nodemailer = require('nodemailer');
const { MailtrapTransport } = require('mailtrap');

class EmailSender {
  //creat Transporter and send the Email
  static createTransporter() {
    const platform = process.env.EMAIL_PLATFORM;
    const token = process.env.EMAIL_TOKEN;

    if (!platform) {
      throw new Error(
        'Missing email configuration. Please check environment variables.'
      );
    }

    switch (platform.toLowerCase()) {
      case 'mailtrap':
        return nodemailer.createTransport(
          MailtrapTransport({
            token: token,
            testInboxId: 3282889,
          })
        );
      case 'brevo':
        return nodemailer.createTransport({
          host: process.env.BREVO_HOST,
          port: process.env.BREVO_PORT,
          auth: {
            user: process.env.BREVO_LOGIN,
            pass: process.env.BREVO_PASSWORD,
          },
        });

      default:
        throw new Error(`Unsupported email platform: ${platform}`);
    }
  }

  static async sendEmail(options) {
    try {
      const transporter = this.createTransporter();

      options.from = process.env.SENDEREMAIL;
      options.category = 'Integration Test';
      options.sandbox = process.env.NODE_ENV !== 'production';

      await transporter.sendMail(options);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

class EmailFactory {
  //email content creator
  constructor(template) {
    this.template = template;
  }
  createContent(emailData) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${this.template}.pug`,
      emailData
    );
    const content = {
      subject: emailData.subject,
      html,
      text: htmlToText.convert(html),
    };

    return content;
  }
}

class EmailService {
  static async sendWelcomeEmail(user, url) {
    if (!user.email) {
      throw new Error(
        'Invalid parameters: both user email and reset URL are required'
      );
    }
    const emailData = {
      firstName: user.name.split(' ')[0],
      subject: 'Welcome to The Natours family',
      url,
    };
    const emailContent = new EmailFactory('welcome').createContent(emailData);
    emailContent.to = user.email;

    await EmailSender.sendEmail(emailContent);
  }

  static async sendPasswordResetUrl(user, url) {
    if (!user.email || !url) {
      throw new Error(
        'Invalid parameters: both user email and reset URL are required'
      );
    }
    const emailData = {
      firstName: user.name.split(' ')[0],
      subject: 'Password Reset Url (valid for 10 min)',
      url,
    };
    const emailContent = new EmailFactory('passwordReset').createContent(
      emailData
    );
    emailContent.to = user.email;

    await EmailSender.sendEmail(emailContent);
  }
}

module.exports = EmailService;
