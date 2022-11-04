require('dotenv').config();
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: process.env.MAIL_USERNAME, // generated ethereal user
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"😘 Quảng bá du lịch và ẩm thực TP. Cần Thơ" <tuyethuong2510@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Verify Email ✔", // Subject line
        html:  `
        <h3>Xin chào bạn!</h3>
        <h4>Mời bạn nhấp vào link bên dưới để xác minh và đổi mật khẩu.</h4>
        <p>Link: <a href="http://localhost:5000/admin/doi-mat-khau/${dataSend.id}" >Click vào đây </a>👈</p>
        <p>Xin chân thành cảm ơn. ❤️</p>
        `, // html body
    });
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail
}