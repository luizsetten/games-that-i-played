import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	GetCommand,
	type GetCommandInput,
	ScanCommand,
	type ScanCommandInput,
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
		const { gameId, name, finished, timePlayed } =
			validateParamsUpdateGame(event);

		const getCommandParams: GetCommandInput = {
			TableName: GAMES_TABLE,
			Key: {
				gameId,
			},
		};

		const getCommand = new GetCommand(getCommandParams);
		const { Item } = await docClient.send(getCommand);

		if (!Item) return parseResponse(404, { error: "Game not found" });

		const updates: {
			[key: string]: {
				Action: "PUT";
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				Value: any;
			};
		} = {};

		if (name) {
			const scanCommandParams: ScanCommandInput = {
				TableName: GAMES_TABLE,
				FilterExpression: "#name = :name_search",
				ExpressionAttributeNames: { "#name": "name" },
				ExpressionAttributeValues: { ":name_search": name },
			};

			const scanCommand = new ScanCommand(scanCommandParams);
			const { Items } = await docClient.send(scanCommand);
			console.log(Items);

			if (Items && Items.filter((game) => game.gameId !== gameId).length > 0)
				return parseResponse(409, {
					error: "Game with the same name already exists",
				});

			updates.name = { Action: "PUT", Value: name };
		}

		if (typeof finished === "boolean")
			updates.finished = { Action: "PUT", Value: finished };

		if (typeof timePlayed === "number")
			updates.timePlayed = { Action: "PUT", Value: timePlayed };

		const params: UpdateCommandInput = {
			TableName: GAMES_TABLE,
			Key: { gameId },
			AttributeUpdates: updates,
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
