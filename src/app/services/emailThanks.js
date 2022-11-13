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
        from: '"😘 Tour Cần Thơ" <tuyethuong2510@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Email cảm ơn ✔", // Subject line
        html:  `
        <h3>Xin chào bạn!</h3>
        <p>Bạn nhận được email này vì đã gửi gợi ý giúp chúng tôi trên website Quảng bá du lịch và ẩm thực TP. Cần Thơ.</p>
        
        <p>Cảm ơn bạn yêu rất nhiều vì đã gợi ý giúp chúng mình nhé! Nếu bạn biết thêm nhiều địa điểm đẹp, đồ ăn ngon thì hãy tiếp tục giới thiệu cho chúng mình nhé!</p>
        <p>Chúc bạn yêu có một ngày thật vui vẻ 😊</p>
        <p>Xin lỗi nếu email này đã làm phiền bạn. Xin chân thành cảm ơn bạn rất nhiều. ❤️</p>
        `, // html body
    });
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail
}