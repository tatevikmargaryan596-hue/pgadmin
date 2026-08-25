// NPM Modules
import { Model } from 'objection';
//mode class Users table -in not connection
class UsersModel extends Model {
  static get idColumn() {
    return 'id';
  }

  static get tableName() {
    return 'users';
  }

  // static get jsonSchema() {
  //   return {
  //     type: 'object',
  //     required: [],
  //     properties: {
  //       id: { type: 'integer' },
  //       link: { type: 'string', minLength: 1, maxLength: 255 },
  //       text: { type: 'string', minLength: 1, maxLength: 255 },
  //       title: { type: 'string', minLength: 1, maxLength: 255 }
  //     }
  //  // };
  // }

  $beforeInsert() {
    const date = new Date();
    this.created_at = date;
  }

  $beforeUpdate() {
    const date = new Date();
    this.updated_at = date;
  }

  // Contact Methods
 
  static insert(payload) {
    return UsersModel.query().insert(payload).returning('*');
  }
  static getAll() {
    return UsersModel.query();
  }
   static getById(id) {
    return UsersModel.query().findById(id);     
      
  }
   static updateById(id, payload) {
    return UsersModel.query().patchAndFetchById(id, payload);      
      
  }
   static deleteById(id) {
    return UsersModel.query().deleteById(id);      
      
  }
}



export default UsersModel;
