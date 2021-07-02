import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { parseUser } from '../../todo/parse'
import { db_update } from '../../todo/database'

const logger = createLogger('updateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Event', { "data": event } )

    const user = parseUser(event);
    logger.info('User', { "data": user })

    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    logger.info('Request', { "data": todoId, "updates": JSON.stringify(updatedTodo) })

    await db_update(user, todoId, updatedTodo)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: ""
    }
}
