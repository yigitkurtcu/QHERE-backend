const nodemailer = require('nodemailer');
const MailService = {};


MailService.getMail=(req)=>{
    return new Promise((resolve,reject)=>{

        console.log(req.email)

        let user = 'qheredeneme@gmail.com';
        let pass = 'MetYi2018';
        let to = req.email;
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
            html:  "<b>QHERE şifrenizi değiştirmek için linke tıklayınız</b>"+" "+
            "<a href=http://localhost:3000/PasswordChangeForm/"+req._id+">http://localhost:3000/PasswordChangeForm/"+req._id+"</a>"
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