import { createGameLambda } from "./src/handlers/games/create";
import { deleteGameLambda } from "./src/handlers/games/delete";
import { getGameLambda } from "./src/handlers/games/get";
import { listGamesLambda } from "./src/handlers/games/list";
import { updateGameLambda } from "./src/handlers/games/update";

module.exports.create = createGameLambda;
module.exports.list = listGamesLambda;
module.exports.get = getGameLambda;
module.exports.update = updateGameLambda;
module.exports.delete = deleteGameLambda;
