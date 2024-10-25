import type { LambdaFunctionURLResult } from "aws-lambda";

export const parseResponse = (
	status: number,
	body?: object,
): LambdaFunctionURLResult => ({
	statusCode: status,
	body: body && JSON.stringify(body),
});
