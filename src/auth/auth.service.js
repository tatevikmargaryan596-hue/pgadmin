import jwt from 'jsonwebtoken';
import { UsersModel } from '../models';
import { ErrorsUtil, CryptoUtil } from '../utils';
import MailService from '../services/mail.service';


import config from '../config/variables.config';
import a from '../../migrations/1_create_collection';
import bcrypt from 'bcryptjs/dist/bcrypt';
const User = a.User
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

    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_ACTIVE_TIME });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_ACTIVE_TIME });

    return { accessToken, refreshToken };
  }

  static validateAccessToken(accessToken) {
    try {
      return jwt.verify(accessToken, JWT_ACCESS_SECRET);
    } catch (error) {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedError('Token has expired');
        } else {
          throw new UnauthorizedError('Token is invalid');
        }
      }

    }
  }

  static validateRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    } catch (error) {
      throw new UnauthorizedError("refresh token is not same");
    }
  }

  static async refresh(token) {
    const user = AuthService.validateRefreshToken(token);
    delete user.iat;
    delete user.exp;

    const { accessToken, refreshToken } = AuthService.generateTokens(user);

    const payload = {
      accessToken,
      refreshToken,
      ...user
    };
    return payload;
  }

  static async login(email, password) {
    const user = await User.findOne({email});

    if (!user) throw new InputValidationError('Invalid adminname or password');
    if (!CryptoUtil.isValidPassword(password, user.password)) {
      throw new InputValidationError('Invalid adminname or password');
    }
    
    delete user.password;
    const { accessToken, refreshToken } = AuthService.generateTokens({ ...user });
  

    const payload = {      
      users_id: user._id,
      email: user.email,      
      role: user.role,
      accessToken,
      refreshToken
    };
    return payload;
  }
 static async registration(email, password, role) {
  try {
    // 1. Ստուգել, արդյոք օգտատերը արդեն կա
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new InputValidationError('User with this email already exists');
    }

    // 2. Գաղտնաբառի հեշավորում (կարևոր է անվտանգության համար)
    // Օգտագործեք ձեր CryptoUtil-ը կամ bcrypt
    const hashedPassword = await CryptoUtil.createHash(password); 

    // 3. Ճիշտ ձևաչափով օբյեկտի ստեղծում
    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      role: role
    });

    const userObj = newUser.toObject();
    delete userObj.password;
    
    return userObj;

  } catch (err) {
    // Տպեք իրական սխալը կոնսոլում, որպեսզի հասկանաք՝ ինչն է խնդիրը
    console.error("Registration Error Detail:", err);
    
    // Եթե սխալը վավերացման սխալ է, թողեք այն, հակառակ դեպքում նետեք սխալ
    throw err; 
  }
}
}


