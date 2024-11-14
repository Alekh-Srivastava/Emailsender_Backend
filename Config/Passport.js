const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// function GetAccessToken(accessToken, refreshToken) {

// }
var AccessToken, RefreshToken, Profile;

function setInfo(accessToken, refreshToken, profile) {
  AccessToken = accessToken;
  RefreshToken = refreshToken;
  Profile = profile;
}

function GetInfo(){
  return {AccessToken, RefreshToken, Profile}
}





passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      setInfo(accessToken,refreshToken,profile);
      console.log('Google Profile:', profile);
      done(null, profile);
    }
  )
);

module.exports=GetInfo;

