/* eslint-disable guard-for-in */
import { Model } from "objection";

class StorageInfoModel extends Model {
  static get idColumn() {
    return "id";
  }

  static get tableName() {
    return "storage";
  }

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

  static async getAllStorageInfo(users_id, branch_address) {
    return StorageInfoModel.query()
      .select("*")
      .where("users_id", "=", users_id)
      .andWhere("branch_address", "=", branch_address);
  }

  static async getStorageInfoByCategory(
    users_id,
    branch_address,
    category_name
  ) {
    return StorageInfoModel.query()
      .select("*")
      .where("users_id", "=", users_id)
      .andWhere("branch_address", "=", branch_address)
      .andWhere("category_name", "=", category_name);
  }

  static async addStorageInfo(payload) {
    return StorageInfoModel.query().insert(payload);
  }

  static async getPrice(info) {
    let price = 0;
    for (const i in info.content) {
      const res = await StorageInfoModel.query()
        .select("*")
        .where("users_id", "=", info.users_id)
        .andWhere("branch_address", "=", info.branch_address[0])
        .andWhere("name", "=", info.content[i].brand);
      price +=
        Number(info.content[i].count) * Number(res[0].info[0].exportPrice);

    }
    return price;
  }
}

export default StorageInfoModel;
