import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DeleteCommand,
	type DeleteCommandInput,
	DynamoDBDocumentClient,
	GetCommand,
} from "@aws-sdk/lib-dynamodb";
import type { LambdaFunctionURLHandler } from "aws-lambda";

const GAMES_TABLE = process.env.GAMES_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const deleteGameLambda: LambdaFunctionURLHandler = async (
	event,
	context,
	callback,
) => {
	const gameId = event.pathParameters?.gameId;

	if (!gameId) {
		return {
			statusCode: 401,
			body: JSON.stringify({ error: '"gameId" is required' }),
		};
	}

	try {
		const getCommand = {
			TableName: GAMES_TABLE,
			Key: {
				gameId,
			},
		};

		const scanCommand = new GetCommand(getCommand);
		const { Item } = await docClient.send(scanCommand);

		if (!Item) {
			return {
				statusCode: 404,
				body: JSON.stringify({ error: "Game not found" }),
			};
		}

		const params: DeleteCommandInput = {
			TableName: GAMES_TABLE,
			Key: { gameId },
		};

		const command = new DeleteCommand(params);
		await docClient.send(command);

		return {
			statusCode: 200,
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: "Could not delete game", error }),
		};
	}
};
