const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
 dotenv.config();
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_FROM } = process.env;

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log('Error connecting to email server:', error);
    } else {
        console.log('Server is ready to take our messages:', success);
    }
});

const sendEmail = async (options) => {
    const mailOptions = {
        from: EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.log('Error sending email:', error);
    }
};

module.exports = sendEmail;

