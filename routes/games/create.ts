import { PutCommand } from "@aws-sdk/lib-dynamodb";

export const routeCreate = 
  async (req, res) => {
    const { gameId, name } = req.body;
    if (typeof gameId !== "string") {
      res.status(400).json({ error: '"gameId" must be a string' });
    } else if (typeof name !== "string") {
      res.status(400).json({ error: '"name" must be a string' });
    }
  
    const params = {
      TableName: GAMES_TABLE,
      Item: { gameId, name },
    };
  
    try {
      const command = new PutCommand(params);
      await docClient.send(command);
      res.json({ gameId, name });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Could not create user" });
    }
  }
