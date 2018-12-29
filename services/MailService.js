const nodemailer = require('nodemailer');
const config = require('../config');

const MailService = {};

MailService.getMail = (userInstance, code) =>
  new Promise((resolve, reject) => {
    const user = config.user;
    const pass = config.pass;
    const to = userInstance.email;
    const subject = 'QHERE şifre yenileme talebi';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      }
    });

    const mailOptions = {
      from: user,
      to,
      subject,
      html: `<b>QHERE şifrenizi yenilemek için kodunuz: ${code}</b>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return reject(error);

      return resolve(info);
    });
  });

module.exports = MailService;
