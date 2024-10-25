import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { ValidationError } from "../errors/ValidationError";

export interface IUpdateGameInput {
	gameId: string;
	name?: string;
	finished?: boolean;
	timePlayed?: number;
}

export const validateParamsUpdateGame = (
	event: APIGatewayProxyEventV2,
): IUpdateGameInput => {
	const gameId = event.pathParameters?.gameId;

	if (!gameId) throw new ValidationError('"gameId" is required');

	if (!event.body) throw new ValidationError('"body" is required');

	const body = JSON.parse(event.body);
	const { name, finished, timePlayed } = body;

	if (name && typeof name !== "string")
		throw new ValidationError("'name' must be a string");

	if (finished && typeof finished !== "boolean")
		throw new ValidationError("'finished' must be boolean");

	if (timePlayed && (typeof timePlayed !== "number" || timePlayed < 0))
		throw new ValidationError("'timePlayed' must be a positive number");

	return { gameId, name, finished, timePlayed };
};
