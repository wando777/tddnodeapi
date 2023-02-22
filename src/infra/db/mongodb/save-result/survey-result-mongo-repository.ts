import { MongoHelper } from '../helpers/mongo-helper'
import { SaveSurveyResultModel, SaveSurveyResultRepository } from '@/data/usecases/save-survey-result/db-save-survey-result-protocols'
import { SurveyResultModel } from '@/domain/models/survey-result'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
    async saveResult(surveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
        const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
        const saveSurveyResult = await surveyResultCollection.findOneAndUpdate({
            surveyId: surveyResultData.surveyId,
            userId: surveyResultData.userId
        }, {
            $set: {
                answer: surveyResultData.answer,
                date: surveyResultData.date
            }
        }, {
            upsert: true,
            returnDocument: 'after'
        })
        return saveSurveyResult.value && MongoHelper.map(saveSurveyResult.value)
    }
}