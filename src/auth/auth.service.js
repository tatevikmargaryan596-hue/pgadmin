import jwt from 'jsonwebtoken';
import { UsersModel } from '../models';
import { ErrorsUtil, CryptoUtil } from '../utils';

import config from '../config/variables.config';

const { AUTH } = config;

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_ACTIVE_TIME,
  REFRESH_TOKEN_ACTIVE_TIME
} = AUTH;

const { InputValidationError, UnauthorizedError } = ErrorsUtil;

export default class AuthService {

  static generateTokens(payload) {
    const accessToken = jwt.sign(
      payload,
      JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_ACTIVE_TIME }
    );

    const refreshToken = jwt.sign(
      payload,
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_ACTIVE_TIME }
    );

    return {
      accessToken,
      refreshToken
    };
  }

  static validateAccessToken(accessToken) {
    try {
      return jwt.verify(accessToken, JWT_ACCESS_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token has expired');
      }

      throw new UnauthorizedError('Token is invalid');
    }
  }

  static validateRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (error) {
      throw new UnauthorizedError('Refresh token is not valid');
    }
  }

  static async refresh(token) {
    const user = AuthService.validateRefreshToken(token);

    delete user.iat;
    delete user.exp;

    const { accessToken, refreshToken } =
      AuthService.generateTokens(user);

    return {
      accessToken,
      refreshToken,
      ...user
    };
  }

  static async login(email, password) {
    const user = await UsersModel.login(email);

    if (!user) {
      throw new InputValidationError(
        'Invalid email or password'
      );
    }

    if (!CryptoUtil.isValidPassword(password, user.password)) {
      throw new InputValidationError(
        'Invalid email or password'
      );
    }

    const userPayload = { ...user };
    delete userPayload.password;

    const { accessToken, refreshToken } =
      AuthService.generateTokens(userPayload);

    return {
      users_id: user.id,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken
    };
  }

  static async registration(email, password, role) {
    try {
      const existingUser =
        await UsersModel.query().findOne({ email });

      if (existingUser) {
        throw new InputValidationError(
          'User with this email already exists'
        );
      }

      const hashedPassword =
        await CryptoUtil.createHash(password);

      const newUser =
        await UsersModel.query().insert({
          email,
          password: hashedPassword,
          role
        });

      const userObj = { ...newUser };
      delete userObj.password;

      return userObj;

    } catch (err) {
      console.error(
        'Registration Error Detail:',
        err
      );

      throw err;
    }
  }
}