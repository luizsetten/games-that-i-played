import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	ScanCommand,
	type ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import type { LambdaFunctionURLHandler } from "aws-lambda";
import { parseResponse } from "../../utils/parseResponse";

const GAMES_TABLE = process.env.GAMES_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const listGamesLambda: LambdaFunctionURLHandler = async () => {
	try {
		const params: ScanCommandInput = {
			TableName: GAMES_TABLE,
		};

		const command = new ScanCommand(params);
		const { Items } = await docClient.send(command);

		return parseResponse(200, { games: Items });
	} catch (error) {
		console.log(error);

		return parseResponse(500, { error: "Could not retrieve game" });
	}
};
