import { Collection } from 'mongodb';
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/account-repository/helpers/mongo-helper';
import app from '../config/app'
import env from '../config/env';

let accountCollection: Collection

describe('SignUp Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(env.mongoUrl)
    });

    afterAll(async () => {
        await MongoHelper.disconnect()
    });

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })
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