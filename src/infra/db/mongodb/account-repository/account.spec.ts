import { AccountMongoRepository } from './account'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import env from '../../../../main/config/env'
import { AddAccountModel } from '../../../../domain/usecases/add-account'

let accountCollection: Collection

const makeFakeAccountTest = (): AddAccountModel => ({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
})

describe('Account Mongo Repository', () => {
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

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository();
    }

    it('Should return an account on add success', async () => {
        const sut = makeSut()
        const account = await sut.add(makeFakeAccountTest())
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe(makeFakeAccountTest().name)
        expect(account.email).toBe(makeFakeAccountTest().email)
        expect(account.password).toBe(makeFakeAccountTest().password)
    })
    it('Should return an account on loadByEmail success', async () => {
        const sut = makeSut()
        await accountCollection.insertOne(makeFakeAccountTest())
        const account = await sut.loadByEmail(makeFakeAccountTest().email)
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe(makeFakeAccountTest().name)
        expect(account.email).toBe(makeFakeAccountTest().email)
        expect(account.password).toBe(makeFakeAccountTest().password)
    })
    it('Should return null if loadByEmail fails', async () => {
        const sut = makeSut()
        const account = await sut.loadByEmail(makeFakeAccountTest().email)
        expect(account).toBeFalsy()
    })
})