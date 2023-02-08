import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token';
import { AccountModel } from '../add-account/db-add-account-protocols';
import { LoadAccountByTokenRepository, Decrypter } from './db-load-account-by-token-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
    constructor(
        private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
        private readonly decrypter: Decrypter
    ) { }

    async load(accessToken: string, role?: string): Promise<AccountModel> {
        await this.decrypter.decrypt(accessToken)
        return await new Promise(resolve => resolve(null))
    }
}