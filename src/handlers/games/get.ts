import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	GetCommand,
	type GetCommandInput,
	ScanCommand,
	type ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import type { LambdaFunctionURLHandler } from "aws-lambda";
import { ValidationError } from "../../errors/ValidationError";
import { parseResponse } from "../../utils/parseResponse";
import { validateParamsGetGame } from "../../validators/validateParamsGetGame";

const GAMES_TABLE = process.env.GAMES_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const getGameLambda: LambdaFunctionURLHandler = async (event) => {
	try {
		const { gameId } = validateParamsGetGame(event);

		const getCommandParams: GetCommandInput = {
			TableName: GAMES_TABLE,
			Key: { gameId },
		};

		const getCommand = new GetCommand(getCommandParams);
		const { Item } = await docClient.send(getCommand);

		if (!Item)
			return parseResponse(404, {
				error: 'Could not find game with provided "gameId"',
			});

		return parseResponse(200, { game: Item });
	} catch (error) {
		console.log(error);

		if (error instanceof ValidationError)
			return parseResponse(401, { error: error.message });

		return parseResponse(500, { error: "Could not retrieve game" });
	}
};
