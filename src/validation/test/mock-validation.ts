import { Validation } from '@/presentation/protocols'

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
      validate(input: any): any {
          return null
      }
  }
  return new ValidationStub()
}