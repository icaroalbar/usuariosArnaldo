const nodemailer = require("nodemailer");


let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    auth: {
      user: 'contato@astrocrypto.com.br',
      pass: '123@Capital'
    }
});

module.exports = transporter
