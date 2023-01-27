import { LogControllerDecorator } from '../../main/decorators/log-controller-decorator'
import { Controller } from '../../presentation/protocols'
import { DbAddAccount } from '../usecases/add-account/db-add-account'
import { AddAccountRepository } from './db/account/add-account-repository'
import { Hasher } from './criptography/hasher'
import { LogErrorRepository } from './db/log/log-error-repository'
import { LoadAccountByEmailRepository } from './db/account/load-account-by-email-repository'

export interface SutTypes {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

export interface SutTypesDecorator {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}