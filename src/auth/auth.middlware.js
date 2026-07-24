// Local Modules
import AuthService from './auth.service';
import { ErrorsUtil } from '../utils';
import mongoose from 'mongoose';

const { UnauthorizedError, PermissionError } = ErrorsUtil;

export default class AuthMiddlaware {
  static authenticate() {
    return (req, res, next) => {
      try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) throw new UnauthorizedError('1');

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) throw new UnauthorizedError('2');

        const user = AuthService.validateAccessToken(accessToken);

        if (!user) throw new UnauthorizedError('5');

        res.locals.auth = { user };
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  static authenticateFor(accessScopes) {
  const access = accessScopes.map((r) => `access:${r}`);

  return (req, res, next) => {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) throw new UnauthorizedError("1");

      const accessToken = authorizationHeader.split(" ")[1];
      if (!accessToken) throw new UnauthorizedError("2");
console.log(2)
      const user = AuthService.validateAccessToken(accessToken);
      if (!user) throw new UnauthorizedError("5");

      // Եթե admin է, անմիջապես թույլ ենք տալիս
      if (user.role === "ADMIN") {
        res.locals.auth = { user };
        return next();
      }
console.log(1)
      const scope = `access:${user.role}`;
console.log("scope", scope);
      // if (!access.includes(scope)) {
      //   throw new PermissionError("6");
      // }

      res.locals.auth = { user };
      next();
    } catch (error) {
      next(error);
    }
  };
}

  static authenticateForSocket(client, res, next) {
    try {
      const accessToken = client.handshake.auth.token;

      if (!accessToken) throw new UnauthorizedError('111');

      const user = AuthService.validateAccessToken(accessToken);

      if (!user) throw new UnauthorizedError('333');

      client.client.locals = { user };
      next();
    } catch (error) {
      next(error);
    }
  }
}
