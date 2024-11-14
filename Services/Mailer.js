const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { parseCSVFile} = require('./Csvparser');
const GetInfo = require('./Config/Passport');

const sendEmails = async (filePath) => {
  try {
    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      '816170560753-dhun7flk100n45ndfdas6debi96ojn39.apps.googleusercontent.com',
      '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',
      '/profile'
    );

    oauth2Client.setCredentials({
      refresh_token: GetInfo().RefreshToken,
    });

    // Get a new access token
    const newAccessToken = await oauth2Client.getAccessToken();

    // Configure the transporter
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

    // Parse the CSV file
    const results = await parseCSVFile(filePath);
    console.log('Parsed CSV Data:', results);

    // Iterate through each entry and send email
    for (const data of results) {
      const email = data.email; // Assuming your CSV has a column named 'email'
      if (!email) continue;

      const mailOptions = {
        from: `${GetInfo().Profile.emails[0].value}`,
        to: email,
        subject: 'Hello from Gmail API ',
        text: 'This is an automated email sent using Gmail API and Nodemailer.',
        html: `<h1>Hello ${data.name || ''}!</h1><p>This is an automated email using Gmail API.</p>`,
      };

      try {
        const result = await transport.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}:`, result);
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in sendEmails:', error);
  }
};

module.exports = { sendEmails };
