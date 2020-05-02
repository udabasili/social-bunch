const request = require("supertest");
const Models = require("../models")
const server = require("../loaders/app")
let token;
let userId;
const group = {
    name:'imagine',
    category: "imaging",
}

/**
 * This handles checking user is permitted to access link
 */
describe('Group Route testing', () => {
    /**
     * log in with correct authentication
     */
    beforeEach((done) => {
        request(server)
          .post('/auth/login')
          .send({
            email: "admin@yahoo.com",
            password: "11111111",
          })
          .end((err, response) => {
            token = response.body.message.validator; // save the token!
            userId = response.body.message.currentUser._id
            done();
        });
    });
    
    afterAll(async() => {
        await Models.Group.remove({
            name: group.eventName
        })
    })
        
    describe('GET /user/:userId/group/',  () => {
        it('should return 200 and an array of groups if user joined group successfully', async () => {
            let eventId = await Models.Group.findOne({
                eventName: group.eventName
            })
            eventId = eventId._id 
            const res = await request(server)
                .get(`/user/${userId}/group/${eventId}/join`)
                .set('Authorization', `Bearer ${token}`)
                .send(group)
            expect(res.status).toBe(200)
            expect(res.body.message.length).not.toBe(0)

        })

        it('should return 200 and an array of groups if user left group successfully', async () => {
            let eventId = await Models.Group.findOne({
                eventName: group.eventName
            })
            eventId = eventId._id 
            const res = await request(server)
                .get(`/user/${userId}/group/${eventId}/leave`)
                .set('Authorization', `Bearer ${token}`)
                .send(group)
            expect(res.status).toBe(200)
            expect(res.body.message.length).not.toBe(0)

        })

        it('should return 505 if group Id is invalid', async () => {
            eventId = '244335' 
            const res = await request(server)
                .get(`/user/${userId}/group/${eventId}/join`)
                .set('Authorization', `Bearer ${token}`)
                .send(group)
            expect(res.status).toBe(505)
        })
    })
  
})
