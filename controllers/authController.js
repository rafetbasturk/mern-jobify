import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import User from "../models/userModel.js";
import attachCookies from "../utils/attachCookies.js"

const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all values!")
  }

  const userAlreadyExists = await User.findOne({ email })
  if (userAlreadyExists) throw new BadRequestError("Email already in use!")

  const user = await User.create({ name, email, password })
  const token = user.createJWT()
  attachCookies({ res, token })
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location
    },
    location: user.location
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError("Please provide all values!")
  }

  const user = await User.findOne({ email }).select("+password")

  if (!user) throw new UnAuthenticatedError("Invalid credentials!")

  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) throw new UnAuthenticatedError("Invalid credentials!")

  const token = user.createJWT()
  attachCookies({ res, token })
  user.password = undefined

  res.status(StatusCodes.OK).json({
    user,
    location: user.location
  })
}

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please provide all values');
  }

  const user = await User.findOneAndUpdate({ _id: req.user.userId }, req.body, {
    runValidators: true,
    new: true
  });

  const token = user.createJWT();
  attachCookies({ res, token })

  res.status(StatusCodes.OK).json({
    user,
    location: user.location,
  });
}

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId })
  res.status(StatusCodes.OK).json({
    user,
    location: user.location
  })
}

const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(StatusCodes.OK).json({
    msg: "user logged out!"
  })
}

export { register, login, updateUser, getCurrentUser, logout }