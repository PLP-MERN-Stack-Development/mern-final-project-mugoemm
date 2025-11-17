const nodemailer = require('nodemailer');
const { logger } = require('../middleware/logger');

// Create transporter
const createTransporter = () => {
  // For development, use ethereal email or mailtrap
  if (process.env.NODE_ENV !== 'production') {
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: process.env.EMAIL_PORT || 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // For production, use real SMTP service (Gmail, SendGrid, etc.)
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'ShopHub'} <${process.env.EMAIL_FROM || 'noreply@shophub.com'}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info('Email sent', { 
      to: options.to, 
      subject: options.subject,
      messageId: info.messageId 
    });

    return info;
  } catch (error) {
    logger.error('Email sending failed', { 
      error: error.message,
      to: options.to 
    });
    throw new Error('Email could not be sent');
  }
};

// Email templates
const emailTemplates = {
  verification: (name, verificationUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ShopHub!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Thank you for registering with ShopHub. Please verify your email address to activate your account.</p>
          <p>Click the button below to verify your email:</p>
          <a href="${verificationUrl}" class="button">Verify Email</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  passwordReset: (name, resetUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #dc2626;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p><strong>If you didn't request this, please ignore this email and your password will remain unchanged.</strong></p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  orderConfirmation: (name, orderId, items, total) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Thank you for your order! Your order has been confirmed and will be processed soon.</p>
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Total:</strong> $${total.toFixed(2)}</p>
          </div>
          <p>You can track your order status in your account dashboard.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

// Send verification email
const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/verify-email/${token}`;
  
  await sendEmail({
    to: user.email,
    subject: 'Verify Your Email - ShopHub',
    html: emailTemplates.verification(user.name, verificationUrl),
  });
};

// Send password reset email
const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password/${token}`;
  
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request - ShopHub',
    html: emailTemplates.passwordReset(user.name, resetUrl),
  });
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (user, order) => {
  await sendEmail({
    to: user.email,
    subject: `Order Confirmation #${order._id} - ShopHub`,
    html: emailTemplates.orderConfirmation(
      user.name,
      order._id,
      order.items,
      order.totalAmount
    ),
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
};
