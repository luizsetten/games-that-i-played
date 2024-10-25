import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { ValidationError } from "../errors/ValidationError";

export interface IDeleteGameInput {
	gameId: string;
}

export const validateParamsDeleteGame = (
	event: APIGatewayProxyEventV2,
): IDeleteGameInput => {
	const gameId = event.pathParameters?.gameId;

	if (!gameId) throw new ValidationError('"gameId" is required');

	return { gameId };
};
