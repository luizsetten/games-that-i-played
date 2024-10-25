# Games That I Played

This repository provides a serverless API for managing a list of games that you have played. It is built using the Serverless Framework, Node.js, and TypeScript, and it runs on AWS Lambda with DynamoDB as the backend.

## Features

- **Serverless Architecture**: Uses AWS Lambda for a scalable, cost-efficient solution.
- **API Development**: Provides endpoints to manage game data.
- **DynamoDB Integration**: Uses DynamoDB for data storage.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Serverless Framework](https://www.serverless.com/)
- AWS Account

## Getting Started

1. **Clone the repository**:

   ```
   git clone https://github.com/luizsetten/games-that-i-played.git
   ```

2. **Install dependencies**:

   ```
    cd games-that-i-played
    npm install
   ```

3. **Configure AWS Credentials:** Make sure your AWS credentials are set up properly.

## Deployment

- _Note_: Before deploying create `.env` file following the example of `.env.example` filling it with your credentials.

To deploy the project, use the Serverless Framework:

```
serverless deploy
```

This will deploy the API to AWS Lambda.

After running deploy, you should see output similar to:

```
Deploying "aws-node-express-dynamodb-api" to stage "dev" (us-east-1)

✔ Service deployed to stack aws-node-express-dynamodb-api-dev (109s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: aws-node-express-dynamodb-api-dev-api (3.8 MB)
```

## Local development

The easiest way to develop and test your function is to use the `dev` command:

```
serverless dev
```

This will start a local emulator of AWS Lambda and tunnel your requests to and from AWS Lambda, allowing you to interact with your function as if it were running in the cloud.

Now you can invoke the function as before, but this time the function will be executed locally. Now you can develop your function locally, invoke it, and see the results immediately without having to re-deploy.

When you are done developing, don't forget to run `serverless deploy` to deploy the function to the cloud.

## Endpoints

    GET /games: Retrieve a list of games.
    POST /games: Add a new game.
    PUT /games/{id}: Update game details.
    DELETE /games/{id}: Delete a game.

## Tech Stack

    Node.js: JavaScript runtime environment.
    TypeScript: Typed superset of JavaScript.
    Serverless Framework: Framework for building serverless applications.
    AWS Lambda: Serverless compute service.
    DynamoDB: NoSQL database service.

## License

This project is licensed under the MIT License.
