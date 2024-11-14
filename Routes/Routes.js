const express = require('express');
const upload = require('../Middlewares/Multer');
const { uploadFile } = require('../Controllers/Controlupload');
const ensureAuthenticated = require('../Middlewares/authmiddlewares');
const GetInfo = require('../Config/Passport') 
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const router = express.Router();

// Define the POST route for file upload
router.post('/upload', upload.single('file'), uploadFile);

// const newAccessToken = await oauth2Client.getAccessToken();
router.get('/email', ensureAuthenticated, async(req, res) => {
    
        try {
           console.log("one");
           console.log(GetInfo());
            
           const oauth2Client = new google.auth.OAuth2(
            '816170560753-dhun7flk100n45ndfdas6debi96ojn39.apps.googleusercontent.com',
            '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',
            '/'
          );



            // Set the refresh token
    oauth2Client.setCredentials({
        refresh_token: GetInfo().RefreshToken,
      });
  
      var newAccessToken = "";

      async function set() {
        newAccessToken = await oauth2Client.getAccessToken();
        console.log('New Access Token (inside set):', newAccessToken.token);
      }
      
      // Call `set()` with `await` in an async context
      await set();
     
      console.log('New Refresh Token:', GetInfo().RefreshToken);
          const transport = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
              type: 'OAuth2',
              user: `${GetInfo().Profile.emails[0].value}`,
              clientId: '816170560753-dhun7flk100n45ndfdas6debi96ojn39.apps.googleusercontent.com',
              clientSecret: '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',
              refreshToken: GetInfo().RefreshToken,
              accessToken: newAccessToken.token,
              expires: 3600,
            },
          });
          console.log("two");
      
          const mailOptions = {
            from: `${GetInfo().Profile.emails[0].value}`,
            to: 'harsh510official@gmail.com',
            subject: 'Hello from gmail using API',
            text: 'Hello from gmail email using API',
            html: '<h1>Hello from gmail email using API</h1>',
          };
          console.log("three");

          const result = await transport.sendMail(mailOptions);
          console.log(result);
          
          res.send(`<h1>Welcome,hello`);
        } catch (error) {
            res.send(error);       
            
        }
      
    
      
  });
  

module.exports = router;
