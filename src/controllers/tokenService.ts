import * as jwt from 'jsonwebtoken';
import DataStoredInToken from './dataStoredInToken';
import TokenData from './tokenDataInterface';
import { NextFunction } from 'connect';

const secret = process.env.SECRET;

export class TokenService {

    static decryptMiddleware(req: any, res: any, next: NextFunction) {
        var token = req.headers['authorization'];
        const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
        req.userId = verificationResponse._id;
        next();
    }

    static createToken(user): TokenData {
        const expiresIn = 60 * 60 * 24 * 10; // 10 days
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }

}