import { APIGatewayProxyEvent } from 'aws-lambda'
import { JwtPayload } from '../auth/JwtPayload'
import { decode } from 'jsonwebtoken'

export function parseUser(event: APIGatewayProxyEvent): string {
    const Jwt = event.headers.Authorization.split(' ')[1]
    const payload = decode(Jwt) as JwtPayload
    return payload.sub
}
