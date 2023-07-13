import 'dotenv'
import database from './database'

export async function handler() {

    if (!await database.ready(3 * 1000)) {
        console.error(`Database failed to become ready`)
        return {status: 400}
    }

    console.info(`Databse is ready to work`)

    return {status: 200}
}

if (require.main === module) {
    handler()
}
