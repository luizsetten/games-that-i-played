import { createGameLambda } from "./routes/games/create";
import { getGameLambda } from "./routes/games/get";
import { listGamesLambda } from "./routes/games/list";

module.exports.create = createGameLambda;
module.exports.list = listGamesLambda;
module.exports.get = getGameLambda;
