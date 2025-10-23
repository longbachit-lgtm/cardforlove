const jwt = require("jsonwebtoken");
const promisify = require("util").promisify;

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

const jwtVariable = require("../../variables/jwt");

const userModle = require("../models/User");;

exports.generateToken = async (payload, secretSignature, tokenLife) => {
  try {
    return await sign(
      {
        payload,
      },
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      }
    );
  } catch (error) {
    console.log(`Error in generate access token:  + ${error}`);
    return null;
  }
};

exports.verifyToken = async (token, secretKey) => {
  try {
    return await verify(token, secretKey);
  } catch (error) {
    console.log(`Error in verify access token:  + ${error}`);
    return null;
  }
};

exports.decodeToken = async (token, secretKey) => {
  try {
    return await verify(token, secretKey, {
      ignoreExpiration: true,
    });
  } catch (error) {
    console.log(`Error in decode access token: ${error}`);
    return null;
  }
};

exports.isAuth = async (req, res, next) => {
  // Lấy access token từ header

  const accessTokenFromHeader = req.headers.x_authorization;
    
  if (!accessTokenFromHeader) {
    return res.status(401).send("Không tìm thấy access token!");
  }

  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

  const verified = await this.verifyToken(
    accessTokenFromHeader,
    accessTokenSecret
  );

  if (!verified) {
    return res
      .status(401)
      .send("Bạn không có quyền truy cập vào tính năng này!");
  }

//   const user = await userModle.getUser(verified.payload.username);
//   req.user = user;

  return next();
};
