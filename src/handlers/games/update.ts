import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	GetCommand,
	type GetCommandInput,
	UpdateCommand,
	type UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import type { LambdaFunctionURLHandler } from "aws-lambda";
import { parseResponse } from "../../utils/parseResponse";
import { validateParamsUpdateGame } from "../../validators/validateParamsUpdateGame";
import { ValidationError } from "../../errors/ValidationError";

const GAMES_TABLE = process.env.GAMES_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const updateGameLambda: LambdaFunctionURLHandler = async (event) => {
	try {
		const { gameId, name } = validateParamsUpdateGame(event);

		const getCommand: GetCommandInput = {
			TableName: GAMES_TABLE,
			Key: {
				gameId,
			},
		};

		const scanCommand = new GetCommand(getCommand);
		const { Item } = await docClient.send(scanCommand);

		if (!Item) return parseResponse(404, { error: "Game not found" });

		const params: UpdateCommandInput = {
			TableName: GAMES_TABLE,
			Key: { gameId },
			AttributeUpdates: {
				name: { Value: name, Action: "PUT" },
			},
		};

		const command = new UpdateCommand(params);
		await docClient.send(command);

		return parseResponse(201, { id: gameId });
	} catch (error) {
		console.error(error);

		if (error instanceof ValidationError)
			return parseResponse(401, { error: error.message });

		return parseResponse(500, { error: "Could not update game" });
	}
};
