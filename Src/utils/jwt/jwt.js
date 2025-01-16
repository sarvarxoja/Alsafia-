import jwt from "jsonwebtoken";

export async function jwtSign(id, version) {
  try {
    const SECRET_KEY = process.env.SECRET_KEY;
    const expiresIn = 15 * 60;
    let jwtData = jwt.sign({ id: id, version: version }, SECRET_KEY, {
      expiresIn,
    });

    return jwtData;
  } catch (error) {
    console.log(error.message);
  }
}

export async function jwtVerifySign(email) {
  try {
    const VERIFY_KEY = process.env.SECRET_KEY;

    let jwtData = jwt.sign({ email: email }, VERIFY_KEY, {
      expiresIn: "10m",
    });

    return jwtData;
  } catch (error) {
    console.log(error.message);
  }
}

export async function jwtRefreshSign(id, version) {
  try {
    const SECRET_KEY = process.env.VERIFY_KEY;
    const expiresIn = 30 * 24 * 60 * 60;
    let jwtData = jwt.sign({ id: id, version: version }, SECRET_KEY, {
      expiresIn,
    });

    return jwtData;
  } catch (error) {
    console.log(error);
  }
}
