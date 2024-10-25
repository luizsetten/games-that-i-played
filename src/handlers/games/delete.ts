import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DeleteCommand,
	type DeleteCommandInput,
	DynamoDBDocumentClient,
	GetCommand,
} from "@aws-sdk/lib-dynamodb";
import type { LambdaFunctionURLHandler } from "aws-lambda";
import { validateParamsDeleteGame } from "../../validators/validateParamsDeleteGame";
import { parseResponse } from "../../utils/parseResponse";
import { ValidationError } from "../../errors/ValidationError";

const GAMES_TABLE = process.env.GAMES_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const deleteGameLambda: LambdaFunctionURLHandler = async (event) => {
	try {
		const { gameId } = validateParamsDeleteGame(event);

		const getCommand = {
			TableName: GAMES_TABLE,
			Key: {
				gameId,
			},
		};

		const scanCommand = new GetCommand(getCommand);
		const { Item } = await docClient.send(scanCommand);

		if (!Item) return parseResponse(404, { error: "Game not found" });

		const params: DeleteCommandInput = {
			TableName: GAMES_TABLE,
			Key: { gameId },
		};

		const command = new DeleteCommand(params);
		await docClient.send(command);

		return parseResponse(200);
	} catch (error) {
		console.error(error);
		if (error instanceof ValidationError)
			return parseResponse(401, { error: error.message });

		return parseResponse(500, { error: "Could not delete game" });
	}
};
