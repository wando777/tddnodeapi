import { AddSurveyModel, AddSurveyRepository } from '../../../../data/usecases/add-survey/db-add-survey-protocols';
import { LoadSurveyRepository } from '../../../../data/usecases/load-survey/db-load-survey-protocols';
import { SurveyModel } from '../../../../domain/models/survey';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveyRepository {
    async loadAll(): Promise<SurveyModel[]> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        const surveys = await surveyCollection.find({}).toArray()
        return surveys && MongoHelper.mapList(surveys)
    }

    async add(surveyData: AddSurveyModel): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.insertOne(surveyData)
    }
}