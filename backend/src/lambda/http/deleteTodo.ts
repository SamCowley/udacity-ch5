import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { parseUser } from '../../todo/parse'
import { db_delete } from '../../todo/database'

const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Event', { "data": event } )

    const user = parseUser(event);
    logger.info('User', { "data": user })

    const todoId = event.pathParameters.todoId
    logger.info('Request', { "data": todoId } )

    await db_delete(user, todoId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: ""
    }
}
