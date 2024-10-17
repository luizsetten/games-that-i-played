import { createGameLambda } from "./routes/games/create";
import { listGamesLambda } from "./routes/games/list";

module.exports.create = createGameLambda;
module.exports.list = listGamesLambda;
