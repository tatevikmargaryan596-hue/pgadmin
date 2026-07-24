// Local Modules
import { superAdminServices } from '../services';
import { SuccessHandlerUtil } from '../utils';

export default class superAdminController {
  static async changeInvitationStatus(req, res, next) {
    try {
      const {invitationId} = req.params;
      const {status} = req.body;
      const result = await superAdminServices.changeInvitationStatus(invitationId, status);

      SuccessHandlerUtil.handleAdd(res, next, result);
    } catch (error) {
      next(error);
    }
  }
}
