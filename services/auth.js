const jwt = require('jsonwebtoken');
const config = require('../config');
const Models = require('../models')

/**
 * Handle authentication functions
 */
class AuthService {

    constructor(user, imageUrl = null){
        this.user = user;
        this.imageUrl = imageUrl
    }

    /**
     * 
     * @param {Object} user 
     * create the jwt token
     */
    generateToken (user){
        const u = {
            username: user.username,
            _id: user._id.toString(),
            imageUrl: user.imageUrl
        };
        return jwt.sign(u, config.secretKey, {
           expiresIn: 60 * 60 * 24 
        });
    }

    async addAdminToUser(currentUser){
        let adminUser  = await Models.User.findOne({
            isAdmin:true
        })
        let filteredAdminUser = await adminUser.filterUserData()
        let filteredCurrentUser = await currentUser.filterUserData()
        await adminUser.addFriend(filteredCurrentUser)
        await currentUser.addFriend(filteredAdminUser)
    }

    async SignUp() {
        let newUser = await Models.User.create(this.user);
        await newUser.encryptPassword()
        newUser.userImage = this.imageUrl;
        newUser = await newUser.save();
        if (newUser.username === 'admin') {
            newUser.isAdmin = true
        } else {
            newUser.isAdmin = true

            // await this.addAdminToUser(newUser)
        }
        newUser = await newUser.save();
        const generatedToken = this.generateToken(newUser)
        newUser = await newUser.filterUserData()
        return {newUser, generatedToken}
    }

    async SignIn() {
        const {email, password} = this.user;
        const userRecord = await Models.User.findOne({email})
        if (!userRecord){
            throw new Error('User not registered');
        }
        let isMatched = await userRecord.comparePassword(password);        
        if(isMatched){
            const generatedToken = this.generateToken(userRecord);
            const currentUser = userRecord.filterUserData();
            return {currentUser, generatedToken}
        }
        else {
            throw new Error('Email/Password is incorrect');
        }
  }

}



module.exports = AuthService;