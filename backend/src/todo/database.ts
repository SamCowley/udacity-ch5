import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const AWS = require('aws-sdk')
const uuid = require('uuid')
const docClient = new AWS.DynamoDB.DocumentClient()

const TodosTable = process.env.TODOS_TABLE
const TodosIndex = process.env.TODOS_INDEX
const TodosPartKey = process.env.TODOS_PARTKEY
const bucketName = process.env.IMAGES_S3_BUCKET

export async function db_get(id: string): Promise<TodoItem[]> {
    const result = await docClient.query({
        TableName: TodosTable,
        IndexName: TodosIndex,
        KeyConditionExpression: '#partitionKey = :partitionVal',
        ExpressionAttributeNames: {
            '#partitionKey': TodosPartKey
        },
        ExpressionAttributeValues: {
            ':partitionVal': id
        }
    }).promise()

    return result.Items
}

export async function db_create(userId: string, newTodo: any): Promise<TodoItem> {
    const todoId= uuid.v4()

    const newItem = {
        'userId': userId,
        'todoId': todoId,
        'createdAt': new Date().toISOString(),
        'done': false,
        ...newTodo
    }

    await docClient.put({
        'TableName': TodosTable,
        'Item': newItem
    }).promise()

    return newItem
}

export async function db_delete(userId: string, todoId: string) {
    await docClient.delete({
        TableName: TodosTable,
        Key: {
            'userId': userId,
            'todoId': todoId
        }
    }).promise()

    return undefined
}

export async function db_update(userId: string, todoId: string, updateTodo: any): Promise<TodoUpdate> {
    return await docClient.update({
        TableName: TodosTable,
        Key: {
            'userId': userId,
            'todoId': todoId
        },
        UpdateExpression: 'set #nameKey = :nameVal, #dueDateKey = :dueDateVal, #doneKey = :doneVal',
        ExpressionAttributeNames: {
            '#nameKey': 'name',
            '#dueDateKey': 'dueDate',
            '#doneKey': 'done'
        },
        ExpressionAttributeValues: {
            ':nameVal': updateTodo.name,
            ':dueDateVal': updateTodo.dueDate,
            ':doneVal': updateTodo.done
        }
    }).promise()
}

export async function addAttachmentUrl(userId: string, todoId: string): Promise<TodoUpdate> {
    return await docClient.update({
        TableName: TodosTable,
        Key: {
            'userId': userId,
            'todoId': todoId
        },
        UpdateExpression: 'set #urlKey = :urlVal',
        ExpressionAttributeNames: {
            '#urlKey': 'attachmentUrl'
        },
        ExpressionAttributeValues: {
            ':urlVal': `https://${bucketName}.s3.us-east-1.amazonaws.com/${todoId}.png`
        }
    }).promise()
}
