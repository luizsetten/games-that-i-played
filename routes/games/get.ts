import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, GetCommandInput, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaFunctionURLHandler } from "aws-lambda";

const GAMES_TABLE = process.env.GAMES_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const getGameLambda: LambdaFunctionURLHandler = async (event, context, callback) => {
  const gameId = event.pathParameters?.gameId

  if (!gameId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: '"gameId" is required' }),
    }
  }


  try {
    const scanCommandParams = {
      TableName: GAMES_TABLE,
      FilterExpression: "gameId = :id",
      ExpressionAttributeValues: { ":id": gameId }
    };

    const scanCommand = new ScanCommand(scanCommandParams);
    const { Items } = await docClient.send(scanCommand);

    if (Items && Items.length > 0) {
      const gameSelected = Items[0];
      return {
        statusCode: 200,
        body: JSON.stringify(gameSelected),
      }
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Could not find game with provided "gameId"' }),
      }
    }
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve game", erru: error, gameId }),
    }
  }
}