/* eslint-disable @typescript-eslint/no-var-requires */
import { IoCService, LogService } from "../Services";
import { IFramework, IFrameworkHandler } from "../Interfaces";


function updateHandler( handler: any ) {
  // Add Express function in to the Fastify request and response
  return ( req: any, res: any, next: any ) => {
    // Request
    req.get = (headerName: string) => req.headers[headerName];
    
    // Response
    res.json = res.send;
    res.setHeader = (name: string, value: string) => res.header(name, value);

    handler(req, res, next);
  }
}

function updateReqResToExpressish(middlewares: any, handler: any){
  if(!Array.isArray(middlewares)){
    middlewares = [middlewares];
  }
  middlewares= middlewares.map((middleware: any) => updateHandler(middleware));

  if(handler){
    handler = updateHandler(handler);
  }
  return [handler, middlewares];
}

class FastifyFramework implements IFramework {
  client: any;
  _name: string;
  constructor() {
    try {
      const fastify = require('fastify').default;
      const { FastifyInstance } = require('fastify');
      this.client = fastify() as typeof FastifyInstance;
      this._name = "fastify";
    } catch (error: any) {
      if(error.code === 'MODULE_NOT_FOUND'){
        IoCService.use("LogService").then( (loggerService: LogService) => {
          loggerService.error(`Fastify framework didn't install. Run: "npm install fastify @fastify/middie"`);
        });
      }
      throw error;
    }
  }

  private handleMethod(method: string, url:string, middlewares: any, handler: any){
    const [_handler, _middleware] = updateReqResToExpressish(middlewares, handler);
    if (_handler) {
      // @ts-ignore
      this.client[method](url, { preHandler: _middleware as any }, _handler as any);
    } else {
      // @ts-ignore
      this.client[method](url, _middleware[0] as any);
    }
  }

  get(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('get', url, middleware, handler);
  }
  post(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('post', url, middleware, handler);
  }
  put(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('put', url, middleware, handler);
  }
  delete(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('delete', url, middleware, handler);
  }
  patch(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('patch', url, middleware, handler);
  }
  use(middleware: IFrameworkHandler) {
    this.client.register(require('@fastify/middie')).then(() => {
      // @ts-ignore
      return this.client.use(middleware);
    })
  }
  listen(port: number, fn: () => void) {
    return this.client.listen({ port }, fn);
  }
  kill(): void {
    throw new Error("Method not implemented.");
  }
}

// abstract class FastifyResponse implements Response{
//   status(code: number): this {
//     throw new Error("Method not implemented.");
//   }
//   sendStatus(code: number): this {
//     throw new Error("Method not implemented.");
//   }
//   links(links: any): this {
//     throw new Error("Method not implemented.");
//   }
//   send: Send<any, this>;
//   json: Send<any, this>;
//   jsonp: Send<any, this>;
//   sendFile(path: string, fn?: Errback | undefined): void;
//   sendFile(path: string, options: any, fn?: Errback | undefined): void;
//   sendFile(path: unknown, options?: unknown, fn?: unknown): void {
//     throw new Error("Method not implemented.");
//   }
//   sendfile(path: string): void;
//   sendfile(path: string, options: any): void;
//   sendfile(path: string, fn: Errback): void;
//   sendfile(path: string, options: any, fn: Errback): void;
//   sendfile(path: unknown, options?: unknown, fn?: unknown): void {
//     throw new Error("Method not implemented.");
//   }
//   download(path: string, fn?: Errback | undefined): void;
//   download(path: string, filename: string, fn?: Errback | undefined): void;
//   download(path: string, filename: string, options: any, fn?: Errback | undefined): void;
//   download(path: unknown, filename?: unknown, options?: unknown, fn?: unknown): void {
//     throw new Error("Method not implemented.");
//   }
//   contentType(type: string): this {
//     throw new Error("Method not implemented.");
//   }
//   type(type: string): this {
//     throw new Error("Method not implemented.");
//   }
//   format(obj: any): this {
//     throw new Error("Method not implemented.");
//   }
//   attachment(filename?: string | undefined): this {
//     throw new Error("Method not implemented.");
//   }
//   set(field: any): this;
//   set(field: string, value?: string | string[] | undefined): this;
//   set(field: unknown, value?: unknown): this {
//     throw new Error("Method not implemented.");
//   }
//   header(field: any): this;
//   header(field: string, value?: string | string[] | undefined): this;
//   header(field: unknown, value?: unknown): this {
//     throw new Error("Method not implemented.");
//   }
//   headersSent: boolean;
//   get(field: string): string | undefined {
//     throw new Error("Method not implemented.");
//   }
//   clearCookie(name: string, options?: CookieOptions | undefined): this {
//     throw new Error("Method not implemented.");
//   }
//   cookie(name: string, val: string, options: CookieOptions): this;
//   cookie(name: string, val: any, options: CookieOptions): this;
//   cookie(name: string, val: any): this;
//   cookie(name: unknown, val: unknown, options?: unknown): this {
//     throw new Error("Method not implemented.");
//   }
//   location(url: string): this {
//     throw new Error("Method not implemented.");
//   }
//   redirect(url: string): void;
//   redirect(status: number, url: string): void;
//   redirect(url: string, status: number): void;
//   redirect(url: unknown, status?: unknown): void {
//     throw new Error("Method not implemented.");
//   }
//   render(view: string, options?: object | undefined, callback?: ((err: Error, html: string) => void) | undefined): void;
//   render(view: string, callback?: ((err: Error, html: string) => void) | undefined): void;
//   render(view: unknown, options?: unknown, callback?: unknown): void {
//     throw new Error("Method not implemented.");
//   }
//   locals: Record<string, any>;
//   charset: string;
//   vary(field: string): this {
//     throw new Error("Method not implemented.");
//   }
//   app: Application<Record<string, any>>;
//   append(field: string, value?: string | string[] | undefined): this {
//     throw new Error("Method not implemented.");
//   }
//   req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
//   statusCode: number;
//   statusMessage: string;
//   assignSocket(socket: Socket): void {
//     throw new Error("Method not implemented.");
//   }
//   detachSocket(socket: Socket): void {
//     throw new Error("Method not implemented.");
//   }
//   writeContinue(callback?: (() => void) | undefined): void {
//     throw new Error("Method not implemented.");
//   }
//   writeHead(statusCode: number, statusMessage?: string | undefined, headers?: OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined): this;
//   writeHead(statusCode: number, headers?: OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined): this;
//   writeHead(statusCode: unknown, statusMessage?: unknown, headers?: unknown): this {
//     throw new Error("Method not implemented.");
//   }
//   writeProcessing(): void {
//     throw new Error("Method not implemented.");
//   }
//   chunkedEncoding: boolean;
//   shouldKeepAlive: boolean;
//   useChunkedEncodingByDefault: boolean;
//   sendDate: boolean;
//   finished: boolean;
//   connection: Socket | null;
//   socket: Socket | null;
//   setTimeout(msecs: number, callback?: (() => void) | undefined): this {
//     throw new Error("Method not implemented.");
//   }
//   setHeader(name: string, value: string | number | readonly string[]): this {
//     throw new Error("Method not implemented.");
//   }
//   getHeader(name: string): string | number | string[] | undefined {
//     throw new Error("Method not implemented.");
//   }
//   getHeaders(): OutgoingHttpHeaders {
//     throw new Error("Method not implemented.");
//   }
//   getHeaderNames(): string[] {
//     throw new Error("Method not implemented.");
//   }
//   hasHeader(name: string): boolean {
//     throw new Error("Method not implemented.");
//   }
//   removeHeader(name: string): void {
//     throw new Error("Method not implemented.");
//   }
//   addTrailers(headers: OutgoingHttpHeaders | readonly [string, string][]): void {
//     throw new Error("Method not implemented.");
//   }
//   flushHeaders(): void {
//     throw new Error("Method not implemented.");
//   }
//   writable: boolean;
//   writableEnded: boolean;
//   writableFinished: boolean;
//   writableHighWaterMark: number;
//   writableLength: number;
//   writableObjectMode: boolean;
//   writableCorked: number;
//   destroyed: boolean;
//   closed: boolean;
//   errored: Error | null;
//   writableNeedDrain: boolean;
//   write(chunk: any, callback?: ((error: Error | null | undefined) => void) | undefined): boolean;
//   write(chunk: any, encoding: BufferEncoding, callback?: ((error: Error | null | undefined) => void) | undefined): boolean;
//   write(chunk: unknown, encoding?: unknown, callback?: unknown): boolean {
//     throw new Error("Method not implemented.");
//   }
//   setDefaultEncoding(encoding: BufferEncoding): this {
//     throw new Error("Method not implemented.");
//   }
//   end(cb?: (() => void) | undefined): this;
//   end(chunk: any, cb?: (() => void) | undefined): this;
//   end(chunk: any, encoding: BufferEncoding, cb?: (() => void) | undefined): this;
//   end(chunk?: unknown, encoding?: unknown, cb?: unknown): this {
//     throw new Error("Method not implemented.");
//   }
//   cork(): void {
//     throw new Error("Method not implemented.");
//   }
//   uncork(): void {
//     throw new Error("Method not implemented.");
//   }
//   destroy(error?: Error | undefined): this {
//     throw new Error("Method not implemented.");
//   }
// }

export default FastifyFramework;
