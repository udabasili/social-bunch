const request = require("supertest");
const Models = require("../models")
const app = require("../loaders/app")
let token;
/**
 * This handles checking user is permitted to access link
 */
describe('auth middleware', () => {
    /**
     * log in with correct authentication
     */
    beforeAll((done) => {
        request(app)
          .post('/auth/login')
          .send({
            email: "admin@yahoo.com",
            password: "11111111",
          })
          .end((err, response) => {
            token = response.body.message.validator; // save the token!
            done();
        });
    });
        
    
    it("should return 200 if correct token is provided", async () => {
        return request(app)
            .get('/authenticate-user')
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toBe('application/json');
            });
    });
    
    it("should return 401 if false token is provided", async () => {
    token = "faketoken"
    return request(app)
            .get('/authenticate-user')
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
            expect(response.status).toBe(401);
            expect(response.type).toBe('application/json');
            });
    });
  
})
