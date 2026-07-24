// Local Modules
import { OrdersModel } from '../models';

export default class OrdersService {
  static async add(payload) {
    return OrdersModel.create(payload);
  }

  static async getPriceOrder(price) {
    return OrdersModel.getPriceOrder(price);
  }

  static async getById(id) {
    return OrdersModel.getById(id);
  }

  static async getHistoryByBranch(users_id, branch_address, order_status) {
    return OrdersModel.getHistoryByBranch(users_id, branch_address, order_status);
  }

  static async editOrderStatus(id, order_status) {
    return OrdersModel.editOrderStatus(id, order_status);
  }
}
