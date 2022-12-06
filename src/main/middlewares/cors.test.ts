import Request from 'supertest'
import app from '../config/app'

describe('Cors Middleware', () => {
    test('Should enable CORS', async () => {
        app.get('/test_cors', (req, res) => {
            res.send()
        })
        await Request(app)
            .get('/test_cors')
            .expect('access-control-allow-origin', '*')
            .expect('access-control-allow-methods', '*')
            .expect('access-control-allow-headers', '*')
    })
})