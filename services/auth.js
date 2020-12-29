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
        };
        return jwt.sign(u, config.secretKey, {
           expiresIn: 60 * 60 * 24 
        });
    }

    async addAdminToUser(currentUser){
        let adminUser  = await Models.User.findOne({
            isAdmin:true
        })
        if (!adminUser){
            adminUser = new Models.User({
                username: 'admin',
                userImage: 'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
                isAdmin: true,
                email: 'admin@yahoo.com',
                password: '11111111'

            })
            await adminUser.encryptPassword()


            adminUser = await adminUser.save()
        }
        currentUser = await Models.User.findByIdAndUpdate(currentUser._id, {
            $push: {
                friends: adminUser._id
            }
        }, { new: true }).populate('friends', '_id username userImage').select('_id username userImage')
        adminUser = await Models.User.findByIdAndUpdate(adminUser._id, {
            $push: {
                friends: currentUser._id
            }
        }, { new: true }).select('_id username userImage')
    }

    async SignUp() {
        let newUser = await Models.User.create({...this.user, userImage: this.imageUrl});
        await newUser.encryptPassword()
        newUser = await newUser.save();
        if (newUser.username === 'admin') {
            newUser.isAdmin = true
        } else {
            await this.addAdminToUser(newUser)
        }
        newUser = await newUser.save()
        const generatedToken = this.generateToken(newUser)
        newUser = await  Models.User.findById(newUser._id)
            .select('_id username userImage')
            .populate('friends', ['_id', 'username', 'userImage'])
        return {newUser, generatedToken}
    }

    async SignIn() {
        const {email, password} = this.user;
        let currentUser = await Models.User.findOne({email})
            .populate('friends', ['_id', 'username', 'userImage'])
        if (!currentUser){
            throw new Error('User not registered');
        }
        let isMatched = await currentUser.comparePassword(password);        
        if(isMatched){
            currentUser = currentUser.filterUserData()
            const generatedToken = this.generateToken(currentUser);
            return {currentUser, generatedToken}
        }
        else {
            throw new Error('Email/Password is incorrect');
        }
  }

}



module.exports = AuthService;