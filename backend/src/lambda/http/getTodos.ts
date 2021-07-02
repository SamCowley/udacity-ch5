import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { parseUser } from '../../todo/parse'
import { db_get } from '../../todo/database'

const logger = createLogger('getTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Event', { "data": event } )

    const user = parseUser(event);
    logger.info('User', { "data": user })

    const result = await db_get(user)
    logger.info('Results', { "data": JSON.stringify(result) })

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ "items": result })
    }
}
