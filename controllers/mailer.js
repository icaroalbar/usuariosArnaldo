const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "icaro.albar@hpcap.com.br", // generated ethereal user
        pass: "Ilae$110892", // generated ethereal password
    },
});

module.exports = transporter