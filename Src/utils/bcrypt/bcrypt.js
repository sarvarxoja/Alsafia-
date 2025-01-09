import * as bcrypt from "bcrypt";

export async function encodePassword(password) {
  try {
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, SALT);
  } catch (error) {
    console.log(error.message);
  }
}

export async function comparePassword(rawPassword, hash) {
  try {
    return bcrypt.compareSync(rawPassword, hash);
  } catch (error) {
    console.log(error.message);
  }
}
