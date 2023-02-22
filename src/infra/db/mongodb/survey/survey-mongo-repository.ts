import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { LoadSurveyRepository } from '@/data/usecases/load-survey/db-load-survey-protocols'
import { SaveSurveyResultModel, SaveSurveyResultRepository } from '@/data/usecases/save-survey-result/db-save-survey-result-protocols'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveyRepository, SaveSurveyResultRepository, LoadSurveyByIdRepository {
    async loadAll(): Promise<SurveyModel[]> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        const surveys = await surveyCollection.find({}).toArray()
        return surveys && MongoHelper.mapList(surveys)
    }

    async add(surveyData: AddSurveyModel): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.insertOne(surveyData)
    }

    async saveResult(surveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        const saveSurveyResult = await surveyCollection.insertOne(surveyResultData)
        const resultFind = await surveyCollection.findOne(saveSurveyResult.insertedId)
        return resultFind && MongoHelper.map(resultFind)
    }

    async loadOneById(id: string): Promise<SurveyModel> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        const survey = await surveyCollection.findOne({ id })
        return survey && MongoHelper.map(survey)
    }
}