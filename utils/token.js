var jwt = require('jsonwebtoken');

const generateToken  = (user) =>{
    
  let u = {
   username: user.username,
   _id: user._id.toString(),
   imageUrl:user.imageUrl
  };
  return token = jwt.sign(u, process.env.SECRET_KEY, {
     expiresIn: 60 * 60 * 24 
  });
}

module.exports = generateToken;