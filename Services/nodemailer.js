
async function SendMail() {
    try {
  
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'yours authorised email address',
          clientId: '816170560753-dhun7flk100n45ndfdas6debi96ojn39.apps.googleusercontent.com',
          clientSecret: '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',
          refreshToken: Info.default.RefreshToken,
          accessToken: Info.default.AccessToken,
          
        },
        
        tls: {
            rejectUnauthorized: false
          }
      });
  
      const mailOptions = {
        from: `${Info.default.Profile.emails[0].value}`,
        to: 'kartikaysaxena12@gmail.com',
        subject: 'Hello from gmail using API',
        text: 'Hello from gmail email using API',
        html: '<h1>Hello from gmail email using API</h1>',
      };
  
      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      return error;
    }
  }
  
  module.exports=  SendMail;