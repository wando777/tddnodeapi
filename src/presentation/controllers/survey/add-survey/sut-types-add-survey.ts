import { AddSurveyController } from './add-survey-controller';
import { AddSurvey, Validation } from './add-survey-controller-protocols';

export interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}