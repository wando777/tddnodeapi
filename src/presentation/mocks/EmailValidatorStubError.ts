import { EmailValidator } from '@/validation/protocols/email-validator';

export class EmailValidatorStubError implements EmailValidator {
    isValid(email: string): boolean {
        throw new Error()
        // return true
    }
}