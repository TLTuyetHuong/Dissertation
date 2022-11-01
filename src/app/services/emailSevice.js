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
        subject: "Thông tin đặt Tour ✔", // Subject line
        html:  `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt tour <b>${dataSend.nameTour} </b> trên website Quảng bá Du lịch và Ẩm thực TP Cần Thơ của chúng tôi!</p>
        <p>Bạn hãy vui lòng xác nhận lại đầy đủ thông tin: </p>
        <ul>
            <li><b>Họ và Tên: </b>${dataSend.patientName}</li>
            <li><b>Số điện thoại: </b>${dataSend.patientPhone}</li>
            <li><b>Số thành viên tham gia tour:</b></li>
            <ul>
                <li><b>Trẻ em nhỏ hơn 6 tuổi: </b>${dataSend.patientSM6}</li>
                <li><b>Trẻ em từ 6 - 9 tuổi: </b>${dataSend.patientF69}</li>
                <li><b>Từ 10 tuổi trở lên: </b>${dataSend.patientLG10}</li>
            </ul>
        </ul>
        <p><b>Giá của Tour là: </b> ${dataSend.priceTour}</p>
        <p><b>Tổng giá của Tour là: </b> ${dataSend.total}</p>
        <p>Nếu thông tin có sai sót hoặc có thắc mắc, xin vui lòng liên hệ qua email này hoặc qua số điện thoại <b>0774814684</b>.</p>
        <p>Chúng tôi sẽ liên hệ với bạn sau. Chúc bạn có một ngày thật vui vẻ 😊</p>
        <p>Xin chân thành cảm ơn. ❤️</p>
        `, // html body
    });
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail
}