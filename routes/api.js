import express from "express";
import { Login, Register, User, Logout } from "../controllers/AuthController";
import auth from "../middlewares/auth";
import { CreatePermission, GetPermission, UpdatePermission, DeletePermission } from "../controllers/PermissionController";
import { CreateRole, GetRole, UpdateRole, DeleteRole } from "../controllers/RoleController";

const router = express.Router();

router.post('/login', Login)
router.post('/register', Register)
router.get('/user', auth(), User)
router.post('/logout', auth(), Logout)

router.post('/permission', auth(), CreatePermission)
router.get('/permission', auth(), GetPermission)
router.put('/permission/:id', auth(), UpdatePermission)
router.delete('/permission/:id', auth(), DeletePermission)

router.post('/role', auth(), CreateRole)
router.get('/role', auth(), GetRole)
router.put('/role/:id', auth(), UpdateRole)
router.delete('/role/:id', auth(), DeleteRole)

export default router;