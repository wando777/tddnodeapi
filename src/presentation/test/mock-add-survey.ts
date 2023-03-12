import { AddSurvey, AddSurveyParams } from '../controllers/survey/add-survey/add-survey-controller-protocols'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
     async add(input: AddSurveyParams): Promise<void> {
        return await new Promise(resolve => resolve())
     }
  }
  return new AddSurveyStub()
}