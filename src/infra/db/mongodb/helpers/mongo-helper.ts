import { Collection, MongoClient } from 'mongodb';

export const MongoHelper2 = {
    client: null as unknown as MongoClient,
    // async connect(uri: string): Promise<void> {
    //     const client = await MongoClient.connect(process.env.MONGO_URL, {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true
    //     })
    //     // this.client = MongoClient.connect(global.__MONGO_URI__, {
    //     //     useNewUrlParser: true,
    //     //     useUnifiedTopology: true
    //     // })
    // },
    async disconnect(): Promise<void> {
        await this.client.close()
    },

    getCollection(name: string): Collection {
        return this.client.db().collection(name)
    }
}

export const MongoHelper = {
    // Aqui eu defino que as variaveis do objeto tem o valor null e o tipo delas são MongoClient/string,
    // pois essa é a unica forma de fazer isso dentro de uma const
    client: null as MongoClient,
    uri: null as string,

    async connect(uri: string): Promise<void> {
        this.uri = uri
        this.client = await MongoClient.connect(uri)
    },

    async disconnect(): Promise<void> {
        await this.client.close()
        this.client = null
    },

    async getCollection(name: string): Promise<Collection> {
        if (!this.client) {
            await this.connect(this.uri)
        }
        return this.client.db().collection(name)
    },

    map(collection: any): any {
        const { _id, ...rest } = collection
        return {
            id: _id,
            ...rest
        }
    },

    mapList(array: any[]): any[] {
        const newArray = array.map(position => {
            const { _id, ...rest } = position
            return {
                id: _id,
                ...rest
            }
        })
        return newArray
    }
}