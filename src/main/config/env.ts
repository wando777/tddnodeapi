import dotenv from 'dotenv'
dotenv.config()

export default {
    mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api',
    port: process.env.PORT ?? 5050,
    jwtSecret: process.env.SECRET ?? 'secret'
}