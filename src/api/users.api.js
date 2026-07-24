// NPM Modules
import express from 'express';

// Local Modules
import { UsersController } from '../controller';
// import UsersValidation from '../middlewares/validation/users.validation';
import { ImageUploadMiddleware } from '../middlewares/image-upload.middleware';
import { UsersValidationMiddleware } from '../middlewares/validation';
// import AuthMiddleware from '../auth/auth.middlware';

const router = express.Router();

router.post('/insertValues',
  // UsersValidation.validateAddArgs,
  UsersController.insertValues);

router.get('/getValues/:id', UsersController.getValues);


router.delete('/deleteValues/:id', UsersController.deleteValues);

router.put('/updateValues/:id', UsersController.updateValues);

//router.post('/sendmail', UsersController.sendMail); // spasum enq Davitin



// router.get('/user/:usersId',
//   UsersController.getUser);

// router.get('/all',
//   UsersController.getAllUsers);

// router.put('/:id', UsersController.edit);

// router.post(
//   '/addPicture',
//   // AuthMiddleware.authenticateFor(['admin']),
//   ImageUploadMiddleware.upload(),
//   UsersController.addPicture
// );

// router.get('/:category/:companyName/:limit', UsersController.getCompanyDataWithLimit);

//POST http://localhost:3001/api/v1/users/sendMail
router.post(
  '/sendMail',
  UsersValidationMiddleware.validateMailArgs,
  UsersController.sendMail
); // completed

// // Storage Name
// router.get('/storage/getStorageName',
//   UsersController.getStorageName);

// router.post('/storage/addStorageName',
// // UsersValidation.validateAddArgs,
//   UsersController.addStorageName);

// // Storage Info
// router.post('/storage/addStorageInfo',
//   UsersController.addStorageInfo);

// router.get('/storage/getAllStorageInfo',
//   UsersController.getAllStorageInfo);

// router.get('/storage/getStorageInfoByCategory',
//   UsersController.getStorageInfoByCategory);

// router.post('/storage/getPrice',
//   UsersController.getPrice);

export default router;
