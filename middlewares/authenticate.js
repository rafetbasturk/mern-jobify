import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index.js";

const authenticateUser = async (req, res, next) => {

  const token = req.cookies.token
  if (!token) {
    throw new UnAuthenticatedError("Authentication Invalid!")
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    const testUser = userId === "63f942268de6808020a783fc"
    req.user = { userId, testUser }
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalid!")
  }
};

export default authenticateUser;