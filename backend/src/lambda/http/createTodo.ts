import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { parseUser } from '../../todo/parse'
import { db_create } from '../../todo/database'

const logger = createLogger('createTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Event', { "data": event } )

    const user = parseUser(event);
    logger.info('User', { "data": user })

    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    logger.info('Request', { "data": JSON.stringify(newTodo) })

    const newItem = await db_create(user, newTodo)
    logger.info('Item', { "data": JSON.stringify(newItem) })

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            "item": newItem
        })
    }
}
