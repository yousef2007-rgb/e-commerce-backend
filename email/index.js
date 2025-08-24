const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "yoyoradigames@gmail.com",
        pass: "ccdqoimlvrkguohe",
    },
});

const mailOptions = {
    from: "yoyoradigames@gmail.com",
};


const send = async (html, email, subject) => {
    return await transporter.sendMail({ ...mailOptions, html: html, to: [email], subject: subject });
}



module.exports = { send: send };

