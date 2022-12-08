import env from './config/env'
import { MongoHelper } from '../infra/db/mongodb/account-repository/helpers/mongo-helper'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
MongoHelper.connect(env.mongoUrl)
    .then(async () => {
        const app = (await import('./config/app')).default
        app.listen(env.port, () => console.log(`Server running at http://local:${env.port}`))
    }).catch(console.error)
