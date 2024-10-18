import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaFunctionURLHandler } from "aws-lambda";
import { v4 } from "uuid";

const GAMES_TABLE = process.env.GAMES_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const createGameLambda: LambdaFunctionURLHandler = async (event, context, callback) => {
  if (!event.body) return { statusCode: 400 }

  const body = JSON.parse(event.body);

  const { name } = body;
  if (typeof name !== "string") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'name' in request body" }),
    }
  }


  try {
    const scanCommandParams = {
      TableName: GAMES_TABLE,
      FilterExpression: "name = :name_search",
      ExpressionAttributeValues: { ":name_search": name }
    };

    const scanCommand = new ScanCommand(scanCommandParams);
    const { Items } = await docClient.send(scanCommand);

    if (Items && Items.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: "Game with the same name already exists" })
      }
    }

    const id = v4();
    const params = {
      TableName: GAMES_TABLE,
      Item: { gameId: id, name },
    };

    const command = new PutCommand(params);
    await docClient.send(command);

    return {
      statusCode: 201,
      body: JSON.stringify({ id })
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Could not create game", error })
    }
  }
}


