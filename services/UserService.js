const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');
const ObjectId = require('mongoose').Types.ObjectId;

const UserError = require('../errors/UserError');
const TokenService = require('./TokenService');
const MailService = require('./MailService');
const User = require('../models/Users');
const Token = require('../models/Token');
const ForgotCode = require('../models/ForgotCode');
const AuthError = require('../errors/AuthError');
const SystemError = require('../errors/SystemError');

const UserService = {};

UserService.login = req =>
  new Promise((resolve, reject) => {
    User.findOne({ email: req.body.email })
      .then(userInstance => {
        if (!userInstance) return reject(UserError.UserNotFound());
        if (userInstance.userType == 'Manager' && userInstance.isAccountActive == false)
          return reject(UserError.UserNotActive());

        bcrypt.compare(req.body.password, userInstance.password, (error, res) => {
          if (!res) return reject(UserError.WrongPassword(error));

          TokenService.generateToken(userInstance)
            .then(token => {
              userInstance = userInstance.toObject();
              const response = {
                userType: userInstance.userType,
                token
              };
              const TokenSave = Token({
                userId: userInstance._id,
                userType: userInstance.userType,
                schoolNumber: userInstance.schoolNumber,
                token: {
                  accessToken: token.accessToken
                }
              });
              TokenSave.save()
                .then(token => resolve(response))
                .catch(err => reject(SystemError.BusinessException(err)));
            })
            .catch(err => reject(SystemError.BusinessException(err)));
        });
      })
      .catch(err => reject(SystemError.BusinessException(err)));
  });

UserService.register = req =>
  new Promise((resolve, reject) => {
    if (req.body.userType == 'Student' && req.body.schoolNumber == '')
      return reject(UserError.UserSchoolNumber());

    User.findOne({ schoolNumber: req.body.schoolNumber }).then(user => {
      if (user && user.schoolNumber !== null) return reject(UserError.UserExist());

      User.findOne({ email: req.body.email })
        .then(userInstance => {
          if (userInstance) return reject(UserError.UserExist());
          const { schoolNumber, fullName, email, password, gender, userType } = req.body;

          bcrypt
            .hash(password, 10)
            .then(hash => {
              const addedUser = User({
                schoolNumber,
                fullName,
                email,
                password: hash,
                gender,
                userType
              });
              addedUser
                .save()
                .then(newUser => resolve(newUser))
                .catch(err => reject(SystemError.BusinessException(err)));
            })
            .catch(err => reject(SystemError.BusinessException(err)));
        })
        .catch(err => reject(SystemError.BusinessException(err)));
    });
  });

UserService.logout = req =>
  new Promise((resolve, reject) => {
    TokenService.verifyToken(req.headers.authorization)
      .then(() => {
        TokenService.removeToken(req.headers.authorization)
          .then(userInstance => resolve(userInstance))
          .catch(() => reject(AuthError.WrongToken()));
      })
      .catch(() => reject(AuthError.WrongToken()));
  });

UserService.forgot = req =>
  new Promise((resolve, reject) => {
    User.findOne({ email: req.body.email })
      .then(userInstance => {
        if (!userInstance) return reject(UserError.UserNotFound());
        const user = {
          _id: userInstance._id,
          email: userInstance.email
        };
        const code = randomstring.generate(7);
        const forgot = new ForgotCode({
          email: req.body.email,
          code
        });
        forgot
          .save()
          .then(() => {
            MailService.getMail(user, code)
              .then(res => resolve(res))
              .catch(err => reject(err));
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });

UserService.resetPassword = req =>
  new Promise((resolve, reject) => {
    ForgotCode.findOne({ code: req.body.code })
      .then(codeInstance => {
        if (!codeInstance) return reject(UserError.CodeNotValid());
        User.findOne({ email: codeInstance.email })
          .then(userInstance => {
            bcrypt
              .hash(req.body.newPassword, 10)
              .then(hashPassword => {
                const newPassword = hashPassword;
                User.findOneAndUpdate(
                  { _id: new ObjectId(userInstance._id) },
                  { $set: { password: newPassword } },
                  { new: true }
                )
                  .then(newUser => {
                    ForgotCode.deleteOne({ code: req.body.code })
                      .then(() => resolve(newUser))
                      .catch(err => reject(SystemError.BusinessException(err)));
                  })
                  .catch(err => reject(SystemError.BusinessException(err)));
              })
              .catch(err => reject(err));
          })
          .catch(err => SystemError.BusinessException(err));
      })
      .catch(err => reject(SystemError.BusinessException(err)));
  });

module.exports = UserService;
