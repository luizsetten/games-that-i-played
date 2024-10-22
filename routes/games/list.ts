import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { Handler } from "aws-lambda";

const GAMES_TABLE = process.env.GAMES_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const listGamesLambda: Handler = async (event, context, callback) => {
	const params = {
		TableName: GAMES_TABLE,
	};

	try {
		const command = new ScanCommand(params);
		const { Items } = await docClient.send(command);

		callback(null, Items);
	} catch (error) {
		console.log(error);
		callback("Could not retrieve items");
	}
};
