import { DbAddAccount } from './db-add-account'
import { Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'

export type SutTypes = {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}