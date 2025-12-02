import express from "express";
import { Login, Register, User, Logout } from "../controllers/AuthController";
import auth from "../middlewares/auth";

const router = express.Router();

router.post('/login', Login)
router.post('/register', Register)
router.get('/user', auth(), User)
router.post('/logout', auth(), Logout)

export default router;