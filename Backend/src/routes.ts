import { Router } from 'express';
import { CreateUserController } from './controllers/user/CreateUserController';
import { ListUsersController } from './controllers/user/ListUsersController';
import { validateSchema } from './middlewares/validateSchema';
import { createUserSchema } from './schemas/userSchemas';


const router = Router();

router.get("/usuarios", new ListUsersController().handle);
router.post("/usuarios", validateSchema(createUserSchema), new CreateUserController().handle);

export { router };