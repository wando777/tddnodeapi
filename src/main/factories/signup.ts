import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { SignUpController } from '../../presentation/controllers/singup/signup';
import { Controller } from '../../presentation/protocols';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LogControllerDecorator } from '../decorators/log';

export const makeSignUpController = (): Controller => {
    const salt = 12
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepo = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepo)
    const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount)
    return new LogControllerDecorator(signUpController)
}