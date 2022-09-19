const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const cookies = req.cookies;
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

  //See if the username exists
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //401 Unauthorized
  //If founduser, evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    //Grab the roles
    const roles = Object.values(foundUser.roles).filter(Boolean);
    //Create JWTs Token. To send to use with the other routes that we want protected in our API.
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
          "roles": roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' } //In production, a few minutes.
    );
    const newRefreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '15s' }
    );


    const newRefreshTokenArray =
      !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

    if (cookies?.jwt) res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    //Save refreshToken with current user

    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();
    console.log(result) //Delete before production

    //http cookie not accesible by js (for security. More secure than localstorage or another cookie)
    //remove secure: true temporarily if want to test with tunder client. Back in for production
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true, sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.json({ accessToken });
    // res.json({'success': `user ${user} is logged in`});
  } else {
    res.sendStatus(401);
  }
}

module.exports = { handleLogin };