import e, { Router } from "express";
const router:Router = e.Router()
import multer from "multer";
import { ImageUpload } from "../controllers/image.controller.js";

const upload = multer({storage:multer.memoryStorage()})

router.post('/upload',upload.single('image'),ImageUpload)

export default router
