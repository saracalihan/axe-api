import IoC from "./../Core/IoC.js";
import { mySQLDetector } from "./detectors/index.js";

const getColumns = async () => {
  const Config = await IoC.use("Config");
  const database = await IoC.use("Database");
  const databaseClient = Config.Database.client.toLowerCase();
  const detectors = {
    mysql: mySQLDetector,
  };

  const detector = detectors[databaseClient];

  if (!detector) {
    throw new Error(`Unsupported database client: ${databaseClient}`);
  }

  return await detector({
    knex: database,
    schema: Config.Database.connection.database,
  });
};

export default async (models) => {
  const columns = await getColumns();
  for (const model of models) {
    model.instance.columns = columns.filter(
      (column) => column.tableName === model.instance.table
    );
  }
};
