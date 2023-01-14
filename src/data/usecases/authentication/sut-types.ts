import { HashComparer } from '../../protocols/criptography/hash-comparer';
import { Encrypter } from '../../protocols/criptography/encrypter';
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../protocols/db/account/update-access-token-repository';
import { DbAuthentication } from './db-authentication';

export interface SutTypesDbAuthentication{
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    encrypterStub: Encrypter
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}