import { AccountMongoRepository } from './account-mongo-repository'
import env from '@/main/config/env'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { mockAddAccountParams } from '@/domain/test'

let accountCollection: Collection

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
    describe('add()', () => {
        it('Should return an account on add success', async () => {
            const sut = makeSut()
            const account = await sut.add(mockAddAccountParams())
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe(mockAddAccountParams().name)
            expect(account.email).toBe(mockAddAccountParams().email)
            expect(account.password).toBe(mockAddAccountParams().password)
        })
    })
    describe('loadByEmail()', () => {
        it('Should return an account on loadByEmail success', async () => {
            const sut = makeSut()
            await accountCollection.insertOne(mockAddAccountParams())
            const account = await sut.loadByEmail(mockAddAccountParams().email)
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe(mockAddAccountParams().name)
            expect(account.email).toBe(mockAddAccountParams().email)
            expect(account.password).toBe(mockAddAccountParams().password)
        })
        it('Should return null if loadByEmail fails', async () => {
            const sut = makeSut()
            const account = await sut.loadByEmail(mockAddAccountParams().email)
            expect(account).toBeFalsy()
        })
    })
    describe('loadByToken()', () => {
        it('Should return an account on loadByToken() without role', async () => {
            const sut = makeSut()
            await accountCollection.insertOne(Object
                .assign({}, mockAddAccountParams(), { accessToken: 'any_token' })
            )
            const account = await sut.loadByToken('any_token')
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe(mockAddAccountParams().name)
            expect(account.email).toBe(mockAddAccountParams().email)
            expect(account.password).toBe(mockAddAccountParams().password)
        })
        it('Should return an account on loadByToken() with admin role on success', async () => {
            const sut = makeSut()
            await accountCollection.insertOne(Object
                .assign({}, mockAddAccountParams(), {
                    accessToken: 'any_token',
                    role: 'admin'
                })
            )
            const account = await sut.loadByToken('any_token', 'admin')
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe(mockAddAccountParams().name)
            expect(account.email).toBe(mockAddAccountParams().email)
            expect(account.password).toBe(mockAddAccountParams().password)
        })
        it('Should return null on loadByToken() with invalid role', async () => {
            const sut = makeSut()
            await accountCollection.insertOne(Object
                .assign({}, mockAddAccountParams(), {
                    accessToken: 'any_token'
                })
            )
            const account = await sut.loadByToken('any_token', 'admin')
            expect(account).toBeFalsy()
        })
        it('Should return an account on loadByToken() if user is admin', async () => {
            const sut = makeSut()
            await accountCollection.insertOne(Object
                .assign({}, mockAddAccountParams(), {
                    accessToken: 'any_token',
                    role: 'admin'
                })
            )
            const account = await sut.loadByToken('any_token')
            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe(mockAddAccountParams().name)
            expect(account.email).toBe(mockAddAccountParams().email)
            expect(account.password).toBe(mockAddAccountParams().password)
        })
        it('Should return null if loadByToken fails', async () => {
            const sut = makeSut()
            const account = await sut.loadByToken('any_token', 'any_role')
            expect(account).toBeFalsy()
        })
    })
    describe('updateAccessToken()', () => {
        it('Should update the account accessToken on updateAccessToken success', async () => {
            const sut = makeSut()
            const res = await accountCollection.insertOne(mockAddAccountParams())
            const fakeAccount = await accountCollection.findOne(res.insertedId)
            expect(fakeAccount.accessToken).toBeFalsy()
            // console.log(fakeAccount && MongoHelper.map(fakeAccount).id)
            await sut.updateAccessToken(fakeAccount._id, 'any_token')
            const account = await accountCollection.findOne({ _id: fakeAccount._id })
            expect(account).toBeTruthy()
            expect(account.accessToken).toBe('any_token')
        })
    })
})