import { BadRequestError } from "../errors/index.js";

const restrictTestUser = async (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError("Test User. Read Only!")
  }
  next()
}

export default restrictTestUser