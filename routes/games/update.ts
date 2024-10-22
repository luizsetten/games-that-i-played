import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	GetCommand,
	UpdateCommand,
	type UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import type { LambdaFunctionURLHandler } from "aws-lambda";

const GAMES_TABLE = process.env.GAMES_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const updateGameLambda: LambdaFunctionURLHandler = async (
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

	if (!event.body) return { statusCode: 400 };

	const body = JSON.parse(event.body);

	const { name } = body;

	if (typeof name !== "string") {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "Missing 'name' in request body" }),
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

		const params: UpdateCommandInput = {
			TableName: GAMES_TABLE,
			Key: { gameId },
			AttributeUpdates: {
				name: { Value: name, Action: "PUT" },
			},
		};

		const command = new UpdateCommand(params);
		await docClient.send(command);

		return {
			statusCode: 201,
			body: JSON.stringify({ id: gameId }),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: "Could not update game", error }),
		};
	}
};
