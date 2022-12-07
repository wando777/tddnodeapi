import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
    it('Should return an account on succes', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'wando',
                email: 'wando@mail.com',
                password: '123senha',
                passwordConfirmation: '123senha'
            })
            .expect(200)
    })
})