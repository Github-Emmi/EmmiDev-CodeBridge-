const jwt = require('jsonwebtoken');

// Generate JWT Token
exports.generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Send token response (cookie + JSON)
exports.sendTokenResponse = async (user, statusCode, res) => {
  const token = this.generateToken(user._id);

  // Populate enrolledCourses with title and thumbnail
  const populatedUser = await user.populate('enrolledCourses', 'title thumbnail');

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role: populatedUser.role,
        avatarUrl: populatedUser.avatarUrl,
        verifiedTutor: populatedUser.verifiedTutor,
        enrolledCourses: populatedUser.enrolledCourses
      }
    });
};
