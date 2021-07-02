import * as AWS from 'aws-sdk'
const s3 = new AWS.S3({ signatureVersion: 'v4' })

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.IMAGES_URL_EXPIRATION

export async function getUploadUrl(todoId: string): Promise<string> {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: `${todoId}.png`,
        Expires: parseInt(urlExpiration, 10)
    })
}
