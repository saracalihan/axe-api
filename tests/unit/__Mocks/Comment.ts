import {
  IHandlerBasedTransactionConfig,
  IRelation,
  IRequest,
  IResponse,
} from "../../../src/Interfaces";
import {NextFunction } from "express";
import Model from "../../../src/Model";

class Comment extends Model {
  get middlewares(): ((
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ) => void)[] {
    return [() => {}, () => {}];
  }

  get transaction(): null {
    return null;
  }

  author() {
    return this.hasOne("Author", "comment_id", "id");
  }
}

export default Comment;
