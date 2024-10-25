import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { ValidationError } from "../errors/ValidationError";

export interface ICreateGameInput {
	name: string;
	finished?: boolean;
	timePlayed?: number;
}

export const validateParamsCreateGame = (
	event: APIGatewayProxyEventV2,
): ICreateGameInput => {
	if (!event.body) throw new ValidationError('"body" is required');

	const body = JSON.parse(event.body);

	const { name, finished, timePlayed } = body;

	if (typeof name !== "string" || !name)
		throw new ValidationError("'name' is required");

	if (finished && typeof finished !== "boolean")
		throw new ValidationError("'finished' must be boolean");

	if (timePlayed && (typeof timePlayed !== "number" || timePlayed < 0))
		throw new ValidationError("'timePlayed' must be a positive number");

	return { name, finished, timePlayed };
};
