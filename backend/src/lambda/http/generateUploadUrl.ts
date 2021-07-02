import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { parseUser } from '../../todo/parse'
import { getUploadUrl } from '../../todo/images'
import { addAttachmentUrl } from '../../todo/database'

const logger = createLogger('createTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    logger.info('Event', { "data": event } )

    const user = parseUser(event);
    logger.info('User', { "data": user })

    await addAttachmentUrl(user, todoId)

    const signed_url = await getUploadUrl(todoId)
    logger.info('signed_url', {'data': signed_url })

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 'uploadUrl': signed_url })
  }
}
