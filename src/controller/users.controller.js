// Local Modules
import { SuccessHandlerUtil } from '../utils';
import { UsersService } from '../services';
import config from '../config/variables.config';

const { HOST_OF_SERVER } = config;

export default class UsersController {
  static async insertValues(req, res, next) {
    try {
      const payload = req.body;
      const user = await UsersService.insertValues(payload);
      SuccessHandlerUtil.handleAdd(res, next, user);
    } catch (error) {
      next(error);
    }
  }

  // Storage Info
  static async deleteValues(req, res, next) {
    try {
      const payload = req.params;
      
      const user = await UsersService.deleteValues(payload);
      SuccessHandlerUtil.handleAdd(res, next, user);
    } catch (error) {
      next(error);
    }
  }

  static async updateValues(req, res, next) {
    try {
      console.log("params:", req.params);
      console.log("url:", req.originalUrl);
      const { id } = req.params;
      const payload = req.body;
      const user = await UsersService.updateValues(id, payload);
      SuccessHandlerUtil.handleAdd(res, next, user);
    } catch (error) {
      next(error);
    }
  }

  static async getStorageInfoByCategory(req, res, next) {
    try {
      const { users_id, branch_address, category_name } = req.query;
      const user = await UsersService
        .getStorageInfoByCategory(users_id, branch_address, category_name);
      SuccessHandlerUtil.handleAdd(res, next, user);
    } catch (error) {
      next(error);
    }
  }

  // Storage Name
  static async addStorageName(req, res, next) {
    try {
      const payload = req.body;
      const user = await UsersService.addStorageName(payload);
      SuccessHandlerUtil.handleAdd(res, next, user);
    } catch (error) {
      next(error);
    }
  }

  static async getStorageName(req, res, next) {
    try {
      const user = await UsersService.getStorageName();
      SuccessHandlerUtil.handleGet(res, next, user);
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req, res, next) {
    try {
      const {
        usersId
      } = req.params;
      const user = await UsersService.getUser(usersId);
      SuccessHandlerUtil.handleGet(res, next, user);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const user = await UsersService.getAllUsers();
      SuccessHandlerUtil.handleGet(res, next, user);
    } catch (error) {
      next(error);
    }
  }

  static async addPicture(req, res, next) {
    try {
      const { file } = req;
      const { originalname, filename, path } = file;
      const dirname = `${HOST_OF_SERVER}/${path}`;
      SuccessHandlerUtil.handleAdd(res, next, {
        originalname,
        filename,
        dirname,
        success: true
      });
    } catch (error) {
      next(error);
    }
  }

  static async edit(req, res, next) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const user = await UsersService.edit(id, payload);
      SuccessHandlerUtil.handleAdd(res, next, user);
    } catch (error) {
      next(error);
    }
  }

  static async getValues(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UsersService.getValues(id);
      SuccessHandlerUtil.handleAdd(res, next, user);
    } catch (error) {
      next(error);
    }
  }

  static async getCompanyDataWithLimit(req, res, next) {
    try {
      const { category, companyName, limit } = req.params;
      const user = await UsersService.getCompanyDataWithLimit(category, companyName, limit);
      SuccessHandlerUtil.handleList(res, next, user);
    } catch (error) {
      next(error);
    }
  }

  static async sendMail(req, res, next) {
    try {
      const { name, email, text } = req.body;
      const mailResponse = await UsersService.sendMail(name, email, text);
      SuccessHandlerUtil.handleList(res, next, mailResponse);
    } catch (error) {
      next(error);
    }
  }

  static async getPrice(req, res, next) {
    try {
      const info = req.body;
      const response = await UsersService.getPrice(info);
      SuccessHandlerUtil.handleList(res, next, response);
    } catch (error) {
      next(error);
    }
  }
}
