import Request from 'supertest'
import app from '../config/app'
import { noCache } from './no-cache'

describe('no-cache Middleware', () => {
    test('Should remove all cache from client-side', async () => {
        app.get('/test_no_cache', noCache, (req, res) => {
            res.send()
        })
        await Request(app)
            .get('/test_no_cache')
            .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            .expect('pragma', 'no-cache')
            .expect('expires', '0')
            .expect('surrogate-control', 'no-store')
    })
})