// NPM Modules
import { Model } from 'objection';

class OrdersModel extends Model {
  static get idColumn() { return 'id'; }

  static get tableName() { return 'orders'; }

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.password;
    return json;
  }

  $beforeInsert() {
    const date = new Date();
    this.created_at = date;
  }

  $beforeUpdate() {
    const date = new Date();
    this.updated_at = date;
  }

  // Methods
  static async create(payload) {
    delete payload.id;
    return OrdersModel.query().insert(payload);
  }

  static async getPriceOrder(price) {
    let priceWithKm = Math.round(price / 1000);
    if (priceWithKm <= 10) {
      priceWithKm = 1000;
      return { price: priceWithKm };
    }
    return { price: priceWithKm * 100 };
  }

  static async getHistoryByBranch(users_id, branch_address, order_status) {
    return OrdersModel.query()
      .select('*')
      .where('users_id', '=', users_id)
      .andWhere('branch_address', '=', branch_address)
      .andWhere('order_status', '=', order_status);
  }

  static async getById(id) {
    return OrdersModel.query().select('*').where('id', '=', id);
  }

  static async editOrderStatus(id, order_status) {
    return OrdersModel.query().update({ id, order_status }).where('id', '=', id);
  }
}

export default OrdersModel;
