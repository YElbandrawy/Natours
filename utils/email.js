const nodemailer = require('nodemailer');
const { MailtrapTransport } = require('mailtrap');

class EmailSender {
  static createTransporter() {
    const platform = process.env.EMAIL_PLATFORM;
    const token = process.env.EMAIL_TOKEN;

    if (!platform || !token) {
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

      default:
        throw new Error(`Unsupported email platform: ${platform}`);
    }
  }

  static async sendEmail(options) {
    try {
      const transporter = this.createTransporter();
      const mailOptions = {
        from: process.env.SENDEREMAIL,
        to: options.to,
        subject: options.subject,
        text: options.message,
        html: options.html,
        category: 'Integration Test',
        sandbox: process.env.NODE_ENV !== 'production',
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

class EmailService {
  static async sendWelcomeEmail(user) {
    if (!user.email) {
      throw new Error('Invalid user data: email is required');
    }

    const options = {
      to: user.email,
      subject: 'Welcome to Our Platform!',
      message: "Thank you for joining our platform. We're excited to have you!",
      html: "<h1>Welcome!</h1><p>Thank you for joining our platform. We're excited to have you!</p>",
    };

    await EmailSender.sendEmail(options);
  }

  static async sendPasswordResetUrl(user, url) {
    if (!user.email || !url) {
      throw new Error(
        'Invalid parameters: both user email and reset URL are required'
      );
    }

    const options = {
      to: user.email,
      subject: 'Password Reset URL (valid for 10 minutes)',
      message: `Please use this URL to reset your password: ${url}\nThis link will expire in 10 minutes.`,
      html: `
        <h2>Password Reset Request</h2>
        <p>Please click the link below to reset your password:</p>
        <a href="${url}">Reset Password</a>
        <p><strong>Note:</strong> This link will expire in 10 minutes.</p>
      `,
    };

    await EmailSender.sendEmail(options);
  }
}

module.exports = EmailService;
