import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { ValidationError } from "../errors/ValidationError";

export interface ICreateGameInput {
	name: string;
}

export const validateParamsCreateGame = (
	event: APIGatewayProxyEventV2,
): ICreateGameInput => {
	if (!event.body) throw new ValidationError('"body" is required');

	const body = JSON.parse(event.body);

	const { name } = body;

	if (typeof name !== "string" || !name)
		throw new ValidationError("'name' is required");

	return { name };
};
