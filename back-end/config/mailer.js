import nodemailer from 'nodemailer';
import path from 'path';

const transporter = nodemailer.createTransport({
    service: 'gmail', // Sử dụng Gmail
    auth: {
        user: process.env.EMAIL_USER, // Địa chỉ email của bạn
        pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng hoặc mật khẩu email
    },
});

export const sendEmail = (to, subject, text, attachmentPath, filename) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        attachments: attachmentPath ?
            [
                {
                    path: attachmentPath,
                    filename: filename || path.basename(attachmentPath),
                }] : [], // Đính kèm file nếu có
    };

    return transporter.sendMail(mailOptions);
};
