const request = require('supertest');
const {UserModel} = require("../models")

process.env.NODE_ENV = 'test'

describe('Authentication', () => {
    let app;

    const user = {
        username: 'admin',
        userImage: 'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
        isAdmin: true,
        email: 'admin@yahoo.com',
        password: '11111111',
        bio: 'As a Field Sales Manager with over 8 years of experience driving market share growth in designated territories, I have mastered the ins and outs of pharmaceutical sales and territorial prospecting.After honing and executing these specialties to reach numerous company goals, I was honored with an invitation to join the National Marketing Council.Now, I spend the majority of my time brainstorming sales strategies and connecting with other industry professionals who are interested in talking shop',
        dateOfBirth: Date.now(),
        phoneNumber: '6172223333',
        occupation: 'Field Sales Manager',
        location: 'California'
    }

    beforeAll(async() => {
        app = require('../loaders/app');
        const db = require('../loaders/mongoose')
     
        await db.once('open', function () {
            console.log("Database is running")
        })
         await request(app)
             .post('/api/register')
             .send(user)

    })

    afterAll(async () => {
       await  UserModel.deleteMany({}, () => {
        })
    })
    
    test('should have access code in response body if user is authenticated  ', async () => {

        let registerUser = {
            email: 'admin@yahoo.com',
            password: '11111111',
        }
        try {
            const response = await request(app)
                .post('/api/login')
                .send(registerUser)
            const responseArray = Object.keys(response.body.message)
            expect(responseArray).toContain('accessToken')
        } catch (error) {
            console.log(error.message)
        }
        
        
    });

    test('should return status 401 if user is not authenticated', async () => {
        let registerUser = {
            email: 'admin@yahoo.com',
            password: '1111111',
        }

         try {
             const response = await request(app)
                 .post('/api/login')
                 .send(registerUser)
             expect(response.status).toBe(401)
         } catch (error) {
             console.log(error.message)
         }

    });
    
});