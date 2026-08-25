import { Model } from 'objection';

class UsersModel extends Model {

  static get idColumn() {
    return 'id';
  }

  static get tableName() {
    return 'users';
  }

  $beforeInsert() {
    this.created_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }

  static insert(payload) {
    return UsersModel
      .query()
      .insert(payload)
      .returning('*');
  }

  static getAll() {
    return UsersModel.query();
  }

  static login(email) {
    return UsersModel
      .query()
      .select('*')
      .where({ email })
      .first();
  }

  static updateById(id, payload) {
    return UsersModel
      .query()
      .patchAndFetchById(id, payload);
  }

  static deleteById(id) {
    return UsersModel
      .query()
      .deleteById(id);
  }
}

export default UsersModel;