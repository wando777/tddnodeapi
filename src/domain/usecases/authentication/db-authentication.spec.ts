import { LoadAccountByEmailRepository } from '../../../data/protocols/load-account-by-email-repository'
import { AccountModel } from '../../models/account'
import { AuthenticationModel } from '../authentication'
import { DbAuthentication } from './db-authentication'
import { SutTypesDbAuthentication } from './sut-types'

const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    email: 'any_email',
    name: 'any_name',
    password: 'any_password'
})
const makeFakeAuthentication = (): AuthenticationModel => ({
    email: 'any_email@mail.com',
    password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email: string): Promise<AccountModel> {
            return await new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypesDbAuthentication => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    return ({
        sut,
        loadAccountByEmailRepositoryStub
    })
}

describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
        await sut.auth(makeFakeAuthentication())
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
})