import rateLimiter from 'express-rate-limit';
import { Router } from "express";
import { login, register, updateUser, getCurrentUser, logout } from "../controllers/authController.js";
import authenticateUser from "../middlewares/authenticate.js";
import restrictTestUser from '../middlewares/restrictTestUser.js';

const router = Router()

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many requests from this IP, please try again after 15 minutes',
})

router.post("/register", apiLimiter, register)

router.post("/login", apiLimiter, login)

router.get('/logout', logout);

router.use(authenticateUser)

router.patch("/updateUser", restrictTestUser, updateUser)

router.get("/getCurrentUser", getCurrentUser)

export default router