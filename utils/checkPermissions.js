import { UnAuthenticatedError } from "../errors/index.js"

const checkPermissions = (reqUser, resUserId) => {
  if (reqUser.userId === resUserId.toString()) return
  throw new UnAuthenticatedError("Not authorized to access this route!")
}

export default checkPermissions