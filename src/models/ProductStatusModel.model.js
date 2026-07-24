import { Model } from 'objection';

class ProductStatusModel extends Model {
  static get idColumn() { return 'id'; }

  static get tableName() { return 'product_statuses'; }

  $beforeInsert() {
    const date = new Date();
    this.created_at = date;
  }

  $beforeUpdate() {
    const date = new Date();
    this.updated_at = date;
  }

  static async addName(name, user_id) {
    return ProductStatusModel.query().insert({ name, user_id });
  }

  static async getName(user_id) {
    return ProductStatusModel.query()
      .select('*')
      .where('user_id', '=', user_id)
      .orderBy('id')
      .returning('*');
  }

  static async getAllStatuses() {
    return ProductStatusModel.query().select('*').orderBy('id').returning('*');
  }
}

export default ProductStatusModel;
