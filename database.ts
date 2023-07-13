import { getFromEnv } from 'esbuild-plugin-serverless'
import {
    Driver,
    IDriverSettings,
    IamAuthService,
    getCredentialsFromEnv,
    getSACredentialsFromJson
// } from 'ydb-sdk'
} from './src'

const getDatabase = (config: Config) => {
    const authService =
        process.env.NODE_ENV === 'development'
            ? new IamAuthService(getSACredentialsFromJson('./authorized_key.json'))
            : getCredentialsFromEnv()
    const driver = new Driver({
        ...config,
        authService
    })
    return driver
}

type Config = Pick<IDriverSettings, 'endpoint' | 'database'>

const config: Config = {
    endpoint: getFromEnv('DATABASE_ENDPOINT'),
    database: getFromEnv('DATABASE_NAME')
}

const database = getDatabase(config)

export default database
