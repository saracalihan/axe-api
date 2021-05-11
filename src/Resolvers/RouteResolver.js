import IoC from "./../Core/IoC.js";
import pluralize from "pluralize";
import { RELATIONSHIPS, API_ENDPOINT_SCHEMA } from "./../Constants.js";
import Controller from "./../Controller/index.js";

let Config = null;

const handleErrors = (req, res, error) => {
  const status = error.type === "ApiError" ? error.status : 400;
  let errors = error.content ? error.content : error.message;

  if (Config.Application.env === "production") {
    errors = "An error occurred!";
  }

  const result = {
    errors,
  };

  if (Config.Application.env === "development") {
    result.stack = error.stack;
  }

  res.status(status).json(result);
};

const requestHandler = async (method, req, res, pack) => {
  try {
    await Controller[method]({
      ...pack,
      request: req,
      response: res,
    });
  } catch (error) {
    handleErrors(req, res, error);
  }
};

const _createRoutes = async (
  model,
  urlPrefix = "",
  parentModel = null,
  relation = null
) => {
  const logger = await IoC.use("Logger");
  const app = await IoC.use("App");
  const database = await IoC.use("Database");
  const queryParser = await IoC.use("QueryParser");

  const pack = {
    model,
    parentModel,
    relation,
    Config,
    database,
    logger,
    queryParser,
  };

  const resource = relation
    ? relation.resource
    : pluralize.plural(model.name).toLowerCase();

  // We create and handle routes by not duplicate so many lines.
  for (const httpMethod of Object.keys(API_ENDPOINT_SCHEMA)) {
    if (model.instance.actions.includes(httpMethod)) {
      for (const definition of API_ENDPOINT_SCHEMA[httpMethod]) {
        const url = definition.url(urlPrefix, resource);
        logger.debug(`Model routes created: ${url}`);

        app[httpMethod.toLowerCase()](url, (req, res) => {
          requestHandler(definition.method, req, res, pack);
        });
      }
    }
  }

  if (model.children.length > 0) {
    // We should different parameter name for child routes
    const idKey = pluralize.singular(model.name).toLowerCase() + "Id";
    const subRelations = model.instance.relations.filter(
      (item) => item.type === RELATIONSHIPS.HAS_MANY
    );
    for (const relation of subRelations) {
      const child = model.children.find((item) => item.name === relation.model);
      // It should be recursive
      await _createRoutes(
        child,
        `${urlPrefix}${resource}/:${idKey}/`,
        model,
        relation
      );
    }
  }
};

export default async (map) => {
  Config = await IoC.use("Config");
  const logger = await IoC.use("Logger");

  for (const model of map) {
    await _createRoutes(model);
  }

  logger.info("All routes have been created.");
};
