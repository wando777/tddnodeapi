import { DbAddAccount } from './db-add-account'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { Hasher } from '../../protocols/criptography/hasher'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'

export interface SutTypes {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}