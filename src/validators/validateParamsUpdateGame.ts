import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { ValidationError } from "../errors/ValidationError";

export interface IUpdateGameInput {
	gameId: string;
	name: string;
}

export const validateParamsUpdateGame = (
	event: APIGatewayProxyEventV2,
): IUpdateGameInput => {
	const gameId = event.pathParameters?.gameId;

	if (!gameId) throw new ValidationError('"gameId" is required');

	if (!event.body) throw new ValidationError('"body" is required');

	const body = JSON.parse(event.body);

	const { name } = body;

	if (typeof name !== "string" || !name)
		throw new ValidationError("'name' is required");

	return { gameId, name };
};
