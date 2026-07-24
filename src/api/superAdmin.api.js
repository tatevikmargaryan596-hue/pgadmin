// NPM Modules
import express from 'express';

// Local Modules
import { superAdminController } from '../controller';
import AuthMiddleware from '../auth/auth.middlware';

const router = express.Router();

router.put(
  '/changeInvitationStatus/:invitationId',
    //stex code enq grelu
AuthMiddleware.authenticateFor(["ADMIN"]),
  superAdminController.changeInvitationStatus
);

export default router;
