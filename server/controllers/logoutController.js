const User = require('../model/User');

const handleLogout = async (req, res) => {
  //On front end, also delete the accessToken


  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204); //Successful. No content to send back
  const refreshToken = cookies.jwt;

  //See if refresh token is in db
  const foundUser = await User.findOne({refreshToken}).exec();
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  //If we reach this point, we found the same refresh token in db
  //Delete the refresh token in db

foundUser.refreshToken = '';
const result = await foundUser.save();
console.log(result); //Delete before production

  res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true}); //secure: true - only serves on https. We would add this on production
  res.sendStatus(204);
}

module.exports = { handleLogout }