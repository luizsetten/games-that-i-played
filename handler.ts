import { createGameLambda } from "./routes/games/create";
import { deleteGameLambda } from "./routes/games/delete";
import { getGameLambda } from "./routes/games/get";
import { listGamesLambda } from "./routes/games/list";
import { updateGameLambda } from "./routes/games/update";

module.exports.create = createGameLambda;
module.exports.list = listGamesLambda;
module.exports.get = getGameLambda;
module.exports.update = updateGameLambda;
module.exports.delete = deleteGameLambda;
