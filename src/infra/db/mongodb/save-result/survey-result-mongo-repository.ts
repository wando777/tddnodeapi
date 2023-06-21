import { SaveSurveyResultParams, SaveSurveyResultRepository } from '@/data/usecases/save-survey-result/db-save-survey-result-protocols'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { MongoHelper, QueryBuilder } from '../helpers'
import { ObjectId } from 'mongodb'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
    async saveResult(surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
        const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
        await surveyResultCollection.findOneAndUpdate({
            surveyId: new ObjectId(surveyResultData.surveyId),
            userId: new ObjectId(surveyResultData.userId)
        }, {
            $set: {
                answer: surveyResultData.answer,
                date: surveyResultData.date
            }
        }, {
            upsert: true,
            returnDocument: 'after'
        })
        const surveyResult = await this.loadBySurveyId(surveyResultData.surveyId)
        return surveyResult && MongoHelper.map(surveyResult)
    }

    private async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
        const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
        const query = new QueryBuilder()
            .match({
                surveyId: new ObjectId(surveyId)
            })
            .group({
                _id: 0,
                data: {
                    $push: '$$ROOT'
                },
                count: {
                    $sum: 1
                }
            })
            .unwind({
                path: '$data'
            })
            .lookup({
                from: 'surveys',
                foreignField: '_id',
                localField: 'data.surveyId',
                as: 'survey'
            })
            .unwind({
                path: '$survey'
            })
            .group({
                _id: {
                    surveyId: '$survey._id',
                    question: '$survey.question',
                    date: '$survey.date',
                    total: '$count',
                    answer: {
                        $filter: {
                            input: '$survey.answers',
                            as: 'item',
                            cond: {
                                $eq: ['$$item.answer', '$data.answer']
                            }
                        }
                    }
                },
                count: {
                    $sum: 1
                }
            })
            .unwind({
                path: '$_id.answer'
            })
            .addFields({
                '_id.answer.count': '$count',
                '_id.answer.percent': {
                    $multiply: [{
                        $divide: ['$count', '$_id.total']
                    }, 100]
                }
            })
            .group({
                _id: {
                    surveyId: '$_id.surveyId',
                    question: '$_id.question',
                    date: '$_id.date'
                },
                answers: {
                    $push: '$_id.answer'
                }
            })
            .project({
                _id: 0,
                surveyId: '$_id.surveyId',
                question: '$_id.question',
                date: '$_id.date',
                answers: '$answers'
            })
            .build()
        const surveyResult = await surveyResultCollection.aggregate<SurveyResultModel>(query).toArray()
        return surveyResult?.length ? surveyResult[0] : null
    }
}