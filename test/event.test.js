const request = require("supertest");
const Models = require("../models")
const server = require("../loaders/app")
let token;
let userId;
const event = {
    eventName:'image',
    imageUrl: "https://images.unsplash.com/photo-1544470555-62aaefa30931?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
    date: new Date(),
    time:"10:00pm",

}

/**
 * This handles checking user is permitted to access link
 */
describe('Event Route testing', () => {
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
        await Models.Event.remove({
            name: event.eventName
        })
    })
        
    describe('POST /user/:userId', () => {
        it('should return 200 since userId is valid', async () => {
            const res = await request(server)
                .post(`/user/${userId}/create-event/`)
                .set('Authorization', `Bearer ${token}`)
                .send(event)
            expect(res.status).toBe(200)

        })
  
        it('should return 401 since userId is invalid', async () => {
            userId="1122244555"
            const res = await request(server)
                .post(`/user/${userId}/create-event/`)
                .set('Authorization', `Bearer ${token}`)
                .send(event)
            expect(res.status).toBe(401)
        })
  
    })

    describe('GET /user/:userId/event/',  () => {

        it('should return 200 and an array of events if user joined event successfully', async () => {
            let eventId = await Models.Event.findOne({
                eventName: event.eventName
            })
            eventId = eventId._id 
            const res = await request(server)
                .get(`/user/${userId}/event/${eventId}/join`)
                .set('Authorization', `Bearer ${token}`)
                .send(event)
            expect(res.status).toBe(200)
            expect(res.body.message.length).not.toBe(0)

        })

        it('should return 200 and an array of events if user left event successfully', async () => {
            let eventId = await Models.Event.findOne({
                eventName: event.eventName
            })
            eventId = eventId._id 
            const res = await request(server)
                .get(`/user/${userId}/event/${eventId}/leave`)
                .set('Authorization', `Bearer ${token}`)
                .send(event)
            expect(res.status).toBe(200)
            expect(res.body.message.length).not.toBe(0)

        })

        it('should return 505 if event Id is invalid', async () => {
            eventId = '244335' 
            const res = await request(server)
                .get(`/user/${userId}/event/${eventId}/join`)
                .set('Authorization', `Bearer ${token}`)
                .send(event)
            expect(res.status).toBe(505)

        })
  
    
  
    })
  
})
