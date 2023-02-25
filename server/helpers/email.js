const nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
const fromMail = 'info@pepisandbox.com';
const axios = require("axios").default;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'emailsending.smtp@gmail.com',
        pass: 'emailsending_123'
    }
});

module.exports.sendMail = (toMail, replaceData, type, emailProvider = 'nodemailer') => {    
    return new Promise((resolve, reject) => {
        switch(type){
            case 'sendUserNamePassword':
                var templateFile = 'send-username-password.html';
                var subject = 'Authentication Details';
                break;
            case 'sendResetPassword':
                var templateFile = 'reset-password.html';
                var subject = 'Reset your password';
                break;
            case 'sendOTP':
                var templateFile = 'send-otp.html';
                var subject = 'Verification';
                break;
            default:
                subject = '';
                break;
        }

        fs.readFile(`./server/emails/${templateFile}`, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                console.log(err);
                reject(err)
              } else {
                const template = handlebars.compile(html);
                const htmlToSend = template(replaceData);
                if(emailProvider === 'sendinblue'){
                  let bodyData = {  
                      "sender":{  
                        "name":"Wash&Fold",
                        "email":"washandfoldlaundrette@gmail.com"
                      },
                      "to":[  
                        {  
                            "email":toMail,
                            "name":replaceData.name
                        }
                      ],
                      "subject":"Verification",
                      "htmlContent":htmlToSend
                  }
                  const options = {
                    method: 'POST',
                    url: 'https://api.sendinblue.com/v3/smtp/email',
                    headers: {
                      'Content-Type': 'application/json', 
                      'api-key': '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'
                    },
                    data: bodyData
                  };

                  axios.request(options).then(function (response) {
                    console.log('email sendinblue response', response.data);
                    resolve(response.data);
                  }).catch(function (error) {
                    console.error('email sendinblue error', error);
                    reject(error);
                  });
                }else if(emailProvider === 'pepiPost'){
                  let bodyData = {
                    from: {email: fromMail, name: 'Wash&Fold'},
                    subject: subject,
                    content: [
                      {
                        type: 'html',
                        value: "<p>hello test mail</p>"
                      }
                    ],
                    personalizations: [
                      {
                        // to: [{email: toMail, name: 'Wash&Fold'}]
                        to: [{'sravanreddy.jukanti@gmail.com': toMail, name: 'Wash&Fold'}]
                      }
                    ]
                  }
                  

                  const options = {
                    method: 'POST',
                    url: 'https://emailapi.netcorecloud.net/v5.1/mail/send',
                    headers: {'Content-Type': 'application/json', 'api_key': 'ed49b435d04f04584e8985e15c364947'},
                    data: bodyData
                  };

                  axios.request(options).then(function (response) {
                    console.log('email pepipost response', response.data);
                    resolve(response.data);
                  }).catch(function (error) {
                    console.error('email pepipost error', error);
                    reject(error);
                  });
                }else {
                  const mailOptions = {
                      from: 'Wash&Fold ' + fromMail,
                      to: toMail,
                      subject: subject,
                      html: htmlToSend
                  };
                  transporter.sendMail(mailOptions, function(error, responseStatus) {
                    if (error) {
                      console.log(error);
                      reject(error);
                    } else {
                      resolve(responseStatus)
                    }
                  });
                }                
              }
        });
    });
}