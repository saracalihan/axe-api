import pluralize from "pluralize";
import { RELATIONSHIPS, CAPABILITIES } from "./../Constants.js";
const { ALL, INSERT, SHOW, UPDATE, PAGINATE, DELETE } = CAPABILITIES;

class Model {
  constructor() {
    this.relations = [];
  }

  get table() {
    return pluralize(this.constructor.name.toLowerCase());
  }

  get fillable() {
    return [];
  }

  get validations() {
    return null;
  }

  get capabilities() {
    return [INSERT, SHOW, PAGINATE, UPDATE, DELETE];
  }

  get middlewares() {
    return [];
  }

  hasMany(relatedModel, primaryKey = "id", foreignKey = null) {
    if (!foreignKey) {
      const currentModelName = pluralize.singular(
        this.constructor.name.toLowerCase()
      );
      foreignKey = `${currentModelName}_id`;
    }
    return {
      type: RELATIONSHIPS.HAS_MANY,
      model: relatedModel,
      primaryKey,
      foreignKey,
    };
  }

  hasOne(relatedModel, primaryKey = "id", foreignKey = null) {
    if (!foreignKey) {
      foreignKey = `${pluralize.singular(relatedModel.toLowerCase())}_id`;
    }
    return {
      type: RELATIONSHIPS.HAS_ONE,
      model: relatedModel,
      primaryKey,
      foreignKey,
    };
  }

  belongsTo(relatedModel, primaryKey, foreignKey) {
    return this.hasOne(relatedModel, foreignKey, primaryKey);
  }
}

export default Model;
