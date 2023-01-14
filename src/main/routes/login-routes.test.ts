import { Collection } from 'mongodb';
import { describe } from 'node:test';
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app'
import env from '../config/env';

let accountCollection: Collection

describe('Login Routes', () => {
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

    describe('POST /signup', () => {
        it('Should return 200 on signup success', async () => {
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
})