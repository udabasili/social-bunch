const request = require("supertest");
const Models = require("../models")
const server = require("../loaders/app")
let token;
let token2;
let userAId;
let userBId;
const group = {
    name:'imagine',
    category: "imaging",
}
const userA = {
    email: "admin@yahoo.com",
    password: "11111111",
  }

const userB = {
    email: "test@yahoo.com",
    password: "111111111",
  }

/**
 * This handles checking user is permitted to access link
 */
describe('User and Message Route testing', () => {
    /**
     * log in with correct authentication
     */
    beforeEach((done) => {
        request(server)
          .post('/auth/login')
          .send(userA)
          .end((err, response) => {
            token = response.body.message.validator; // save the token!
            userAId = response.body.message.currentUser._id
            done();
        });

    });

    beforeEach((done) => {
        request(server)
          .post('/auth/login')
          .send(userB)
          .end((err, response) => {
            userBId = response.body.message.currentUser._id;
            token2 = response.body.message.validator;
            done();
        });

    });
    
    
    afterAll(async() => {
        await Models.Group.remove({
            name: group.eventName
        })
    })

    describe('Friend route', () => {
        it('should return 200 if userA successfully sends request to userB ',  async () => {
            let userId = userAId;
            let addedUserId = userBId;
            const res = await request(server)
                .get(`/user/${userId}/send-friend-request/${addedUserId}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)      
            expect(res.body.message.currentUser._id).toBe(userAId)      
            console.log(res.body)
        });

        it('should return 200 if userB accepts userA friend request', async () => {
            let userId = userBId;
            let addedUserId = userAId;
            const res = await request(server)
                .get(`/user/${userId}/accept-friend-request/${addedUserId}`)
                .set('Authorization', `Bearer ${token2}`)
            expect(res.status).toBe(200)  
        });
    });
    
    })
  
