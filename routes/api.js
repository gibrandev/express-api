import express from "express";
import { Login, Register, User, Logout } from "../controllers/AuthController";
import auth from "../middlewares/auth";
import { CreatePermission, GetPermission, UpdatePermission, DeletePermission } from "../controllers/PermissionController";
import { CreateRole, GetRole, UpdateRole, DeleteRole } from "../controllers/RoleController";
import { CreateUser, GetUser, UpdateUser, DeleteUser } from "../controllers/UserController";

const router = express.Router();

router.post('/auth/login', Login)
router.post('/rauth/egister', Register)
router.get('/auth/user', auth(), User)
router.post('/auth/logout', auth(), Logout)

router.post('/user', auth(), CreateUser)
router.get('/user', auth(), GetUser)
router.put('/user/:id', auth(), UpdateUser)
router.delete('/user/:id', auth(), DeleteUser)

router.post('/permission', auth(), CreatePermission)
router.get('/permission', auth(), GetPermission)
router.put('/permission/:id', auth(), UpdatePermission)
router.delete('/permission/:id', auth(), DeletePermission)

router.post('/role', auth(), CreateRole)
router.get('/role', auth(), GetRole)
router.put('/role/:id', auth(), UpdateRole)
router.delete('/role/:id', auth(), DeleteRole)

export default router;