import app from '../config/app'
import env from '../config/env';
import { AddAccountModel } from '@/domain/usecases/account/add-account';
import { SignUpAccountModel } from '@/domain/usecases/account/signup-account';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import request from 'supertest'

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

    const makeFakeAccount = (): SignUpAccountModel => ({
        name: 'wando',
        email: 'wando@mail.com',
        password: '123senha',
        passwordConfirmation: '123senha'
    })

    const makeAddFakeAccount = (): AddAccountModel => ({
        name: 'wando',
        email: 'wando@mail.com',
        password: '123senha'
    })

    describe('POST /signup', () => {
        it('Should return 200 on signup success', async () => {
            await request(app)
                .post('/api/signup')
                .send(makeFakeAccount())
                .expect(200)
        })
    })
    describe('POST /login', () => {
        it('Should return 200 on login success', async () => {
            const password = await hash(makeAddFakeAccount().password, 12)
            await accountCollection.insertOne({
                name: makeAddFakeAccount().name,
                email: makeAddFakeAccount().email,
                password
            })
            await request(app)
                .post('/api/login')
                .send({
                    email: 'wando@mail.com',
                    password: '123senha'
                })
                .expect(200)
        })
        it('Should return 401 on login', async () => {
            await request(app)
                .post('/api/login')
                .send({
                    email: 'wando@mail.com',
                    password: '123senha'
                })
                .expect(401)
        })
    })
})