import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	PutCommand,
	type PutCommandInput,
	ScanCommand,
	type ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import type { LambdaFunctionURLHandler } from "aws-lambda";
import { v4 } from "uuid";
import { validateParamsCreateGame } from "../../validators/validateParamsCreateGame";
import { parseResponse } from "../../utils/parseResponse";
import { ValidationError } from "../../errors/ValidationError";

const GAMES_TABLE = process.env.GAMES_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const createGameLambda: LambdaFunctionURLHandler = async (event) => {
	try {
		const { name, finished, timePlayed } = validateParamsCreateGame(event);

		const scanCommandParams: ScanCommandInput = {
			TableName: GAMES_TABLE,
			FilterExpression: "#name = :name_search",
			ExpressionAttributeNames: { "#name": "name" },
			ExpressionAttributeValues: { ":name_search": name },
		};

		const scanCommand = new ScanCommand(scanCommandParams);
		const { Items } = await docClient.send(scanCommand);

		if (Items && Items.length > 0)
			return parseResponse(409, {
				error: "Game with the same name already exists",
			});

		const gameId = v4();
		const params: PutCommandInput = {
			TableName: GAMES_TABLE,
			Item: { gameId, name, finished, timePlayed },
		};

		const command = new PutCommand(params);
		await docClient.send(command);

		return parseResponse(201, { gameId });
	} catch (error) {
		console.error(error);

		if (error instanceof ValidationError)
			return parseResponse(401, { error: error.message });

		return parseResponse(500, { error: "Could not create game" });
	}
};
