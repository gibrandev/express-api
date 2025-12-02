import express from "express";
import { Login, Register, User, Logout } from "#controllers/AuthController";
import auth from "#middlewares/auth";
import { CreatePermission, GetPermission, UpdatePermission, DeletePermission } from "#controllers/PermissionController";
import { CreateRole, GetRole, UpdateRole, DeleteRole } from "#controllers/RoleController";
import { CreateUser, GetUser, UpdateUser, DeleteUser } from "#controllers/UserController";
import { validate } from "#middlewares/validate";
import { loginSchema } from "#validators/auth";
import { userSchema, userUpdateSchema } from "#validators/user";
import { roleSchema } from "#validators/role";
import { permissionSchema } from "#validators/permission";

const router = express.Router();

router.post('/auth/login', validate(loginSchema), Login)
router.post('/rauth/egister', Register)
router.get('/auth/user', auth(), User)
router.post('/auth/logout', auth(), Logout)

router.post('/user', auth(), validate(userSchema), CreateUser)
router.get('/user', auth(), GetUser)
router.put('/user/:id', auth(), validate(userUpdateSchema), UpdateUser)
router.delete('/user/:id', auth(), DeleteUser)

router.post('/permission', auth(), validate(permissionSchema), CreatePermission)
router.get('/permission', auth(), GetPermission)
router.put('/permission/:id', auth(), validate(permissionSchema), UpdatePermission)
router.delete('/permission/:id', auth(), DeletePermission)

router.post('/role', auth(), validate(roleSchema), CreateRole)
router.get('/role', auth(), GetRole)
router.put('/role/:id', auth(), validate(roleSchema), UpdateRole)
router.delete('/role/:id', auth(), DeleteRole)

export default router;