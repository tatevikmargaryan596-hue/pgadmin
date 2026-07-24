// Local Modules
import invitationModel from "../../migrations/1_create_collection";

export default class SuperAdminServices {
  static async changeInvitationStatus(invitationId, status) {
    return await invitationModel.Invitation.findOneAndUpdate({ _id: invitationId }, { "isPublic": status }); //VOR CHASHXATEC POXENQ BYID
  }
}
