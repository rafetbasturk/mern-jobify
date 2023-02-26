import { Router } from "express";
import{ createJob, deleteJob, getAllJobs, updateJob, showStats } from "../controllers/jobController.js";
import authenticateUser from "../middlewares/authenticate.js";
import restrictTestUser from "../middlewares/restrictTestUser.js";


const router = Router()

router.use(authenticateUser)

router
  .route("/")
  .get(getAllJobs)
  .post(restrictTestUser, createJob)

router.get("/stats", showStats)

router
  .route("/:id")
  .patch(restrictTestUser, updateJob)
  .delete(restrictTestUser, deleteJob)

export default router