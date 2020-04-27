const request = require("supertest");

const server = require("./server.js");
const db = require('../data/dbConfig');

describe('server', () => {
    describe('GET /', () => {
        it('should return 200 ok', () => {
            return request(server)
                .get('/')
                .then(res => {
                    expect(res.status).toBe(200);
                });
        });
    });

    describe('POST /hobbits', () => {
        beforeEach(async () => {
            await db('hobbits').truncate();
        });

        it('should return 201 on success', () => {
            return request(server)
                .post('/hobbits')
                .send({ name: "gaffer" })
                .then(res => {
                    expect(res.status).toBe(201);
                });
        });
        it('should return message saying the hobbit was created', () => {
            return request(server)
                .post('/hobbits')
                .send({ name: "gaffer" })
                .then(res => {
                    expect(res.body.message).toBe("Hobbit created succesfully!");
                });
        });
        it('add hobbit to db', async () => {
            const hobbitName = "gaffer"; 

            const existing = await db('hobbits').where({ name: hobbitName });
            expect(existing).toHaveLength(0);

            await request(server)
                .post('/hobbits')
                .send({ name: hobbitName })
                .then(res => {
                    expect(res.body.message).toBe("Hobbit created succesfully!");
                });
            
            const inserted = await db('hobbits').where({ name: hobbitName });
            expect(inserted).toHaveLength(1);
        });
    });
});