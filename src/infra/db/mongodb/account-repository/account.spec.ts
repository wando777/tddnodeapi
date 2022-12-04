import { AccountMongoRepository } from './account'
import { MongoHelper } from './helpers/mongo-helper'
import { Collection } from 'mongodb'
import env from '../../../../main/config/env'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let accountCollection: Collection

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(env.mongoUrl)
    });

    afterAll(async () => {
        await MongoHelper.disconnect()
    });

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository();
    }

    it('Should return an account on success', async () => {
        const sut = makeSut()
        const accountTest = {
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        }
        const account = await sut.add(accountTest)
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe(accountTest.name)
        expect(account.email).toBe(accountTest.email)
        expect(account.password).toBe(accountTest.password)
    })
})