import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter';
import { Encrypter } from '../../../data/protocols/criptography/encrypter';

export class JwtAdapter implements Encrypter, Decrypter {
    constructor(private readonly secret: string) { }

    async encrypt(value: string): Promise<string> {
        const validToken = jwt.sign({ id: value }, this.secret)
        return validToken
    }

    async decrypt(token: string): Promise<string | null> {
        const descryptedToken: any = jwt.verify(token, this.secret)
        return descryptedToken
    }
}