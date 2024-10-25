import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { ValidationError } from "../errors/ValidationError";

export interface IGetGameInput {
	gameId: string;
}

export const validateParamsGetGame = (
	event: APIGatewayProxyEventV2,
): IGetGameInput => {
	const gameId = event.pathParameters?.gameId;

	if (!gameId) throw new ValidationError('"gameId" is required');

	return { gameId };
};
