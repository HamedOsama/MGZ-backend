const sendToken = async(user, statusCode, res) => {
  const token = await user.generateJWTToken();
  console.log(token)
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure: true,
    path : '/',
    // domain: '.domain.com', 
    sameSite : 'lax',
  };
  user.tokens = null
  user.password = null

  res.status(statusCode).cookie("access_token", token, options).json({
    success: true,
    user,
    token,
  });
  
}

module.exports = sendToken;