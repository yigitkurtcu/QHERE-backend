const nodemailer = require('nodemailer');
const MailService = {};


MailService.getMail=(userInstance, code)=>{
    return new Promise((resolve,reject)=>{
        let user = 'qheredeneme@gmail.com';
        let pass = 'MetYi2018';
        let to = userInstance.email;
        let subject = 'QHERE şifre yenileme talebi';
        
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass
            }
        });

        let mailOptions = {
            from: user,
            to: to,
            subject: subject,
            html:  "<b>QHERE şifrenizi yenilemek için kodunuz: "+ code + "</b>"
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return reject(error);
            } else {
                return resolve(info)
            }
        });
    })
}

module.exports = MailService;