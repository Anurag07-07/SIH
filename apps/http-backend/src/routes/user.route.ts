import e, { Router } from "express";
import { Signup } from "../controllers/user.controller.js";
const router:Router = e.Router()

router.post('/signup',Signup)

export default router
