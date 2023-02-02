import { AddSurveyController } from './add-survey-controller';
import { Validation } from './add-survey-controller-protocols';

export interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}