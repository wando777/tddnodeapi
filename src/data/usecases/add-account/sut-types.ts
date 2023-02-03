import { LogControllerDecorator } from '../../../main/decorators/log-controller-decorator'
import { Controller } from '../../../presentation/protocols'
import { DbAddAccount } from './db-add-account'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { Hasher } from '../../protocols/criptography/hasher'
import { LogErrorRepository } from '../../protocols/db/log/log-error-repository'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'

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