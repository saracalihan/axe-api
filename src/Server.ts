import { FolderResolver, FileResolver, ModelResolver } from "./Resolvers";
import dotenv from "dotenv";
import knex from "knex";
import schemaInspector from "knex-schema-inspector";
import { attachPaginate } from "knex-paginate";
import { ModelTreeBuilder, RouterBuilder } from "./Builders";
import HandlerFactory from "./Handlers/HandlerFactory";
import {
  IApplicationConfig,
  IConfig,
  IFolders,
  IRequest,
  IResponse,
} from "./Interfaces";
import {
  DocumentationService,
  LogService,
  IoCService,
  SchemaValidatorService,
} from "./Services";
import { Frameworks } from "./Enums";
import ExpressFramework from "./Frameworks/ExpressFramework";
import FastifyFramework from "./Frameworks/FastifyFramework";

class Server {
  async start(appFolder: string) {
    dotenv.config();
    const folders = new FolderResolver().resolve(appFolder);
    const fileResolver = new FileResolver();
    const config = await fileResolver.resolve<IConfig>(folders.Config);
    const models = await fileResolver.resolve<IConfig>(folders.Models);
    await this.bindDependencies(folders, config, models);
    await this.loadFramework();
    await this.analyzeModels();
    await this.listen();
  }

  private async bindDependencies(
    folders: IFolders,
    config: Record<string, IConfig>,
    models: Record<string, IConfig>
  ) {
    IoCService.singleton("Folders", () => folders);
    IoCService.singleton("Config", () => config);
    IoCService.singleton("Models", () => models);
    IoCService.singleton("SchemaInspector", () => schemaInspector);
    IoCService.singleton("Database", async () => {
      const config = await IoCService.use("Config");
      const database = knex(config.Database);
      attachPaginate();
      return database;
    });
    IoCService.singleton("Framework", async () => {
      let framework = null, frameworkName = (config.Application as IApplicationConfig).framework || Frameworks.Express;
      if (frameworkName == Frameworks.Fastify) {
        framework = new FastifyFramework();
      } else {
        framework = new ExpressFramework();
      }

      return framework;
    });

    IoCService.singleton("App", async () => await IoCService.use("Framework"));
    IoCService.singleton("HandlerFactory", () => {
      return new HandlerFactory();
    });

    IoCService.singleton(
      "DocumentationService",
      async () => new DocumentationService()
    );
    IoCService.singleton("LogService", async () => {
      const config = await IoCService.use("Config");
      return new LogService(
        (config.Application as IApplicationConfig).logLevel
      );
    });
  }

  private async loadFramework() {
    const app = await IoCService.use("App");
    const framework = await IoCService.use("Framework");
    const logger = await IoCService.useByType<LogService>("LogService");

    // Set global middlewares for axe-api
    switch (framework._name) {
      default:
      case Frameworks.Express:
        const { urlencoded, json } = await import("express");
        app.use(urlencoded({ extended: true }));
        app.use(json());
        break;
      case Frameworks.Fastify:
        break;
    }
    logger.info(`${app._name} has been initialized`);
  }

  private async analyzeModels() {
    await new ModelResolver().resolve();
    await new SchemaValidatorService().validate();
    await new ModelTreeBuilder().build();
    await new RouterBuilder().build();
  }

  private async listen() {
    const config = await IoCService.use("Config");
    const app = await IoCService.use("App");
    const logger = await IoCService.useByType<LogService>("LogService");

    if (config.Application.env === "development") {
      app.get("/docs", async (req: IRequest, res: IResponse) => {
        const docs = await IoCService.useByType<DocumentationService>(
          "DocumentationService"
        );
        const modelTree = await IoCService.use("ModelTree");
        res.json({
          routes: docs.get(),
          modelTree,
        });
      });
      app.get("/docs/routes", async (req: IRequest, res: IResponse) => {
        const docs = await IoCService.useByType<DocumentationService>(
          "DocumentationService"
        );
        res.json(docs.get().map((route) => `${route.method} ${route.url}`));
      });
    }

    app.listen(config.Application.port, () => {
      logger.info(
        `API listens requests on http://localhost:${config.Application.port}`
      );
    });
  }
}

export default Server;
