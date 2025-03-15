import "reflect-metadata";
import express from "express";
import "express-async-errors";
import serverless from "serverless-http";
import logger from "./observability/logger";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.config";
import { errorHandler } from "./middlewares/errorHandler";
import { UserController } from "./controllers/userController";
import { AppDataSource } from "./config/database";
import { validate } from "./middlewares/validate";
import { registerSchema, updateSchema } from "./utils/validation";
import { authMiddleware } from "./middlewares/authMiddleware";
import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(cors());
const userController = new UserController();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post("/login", userController.login);
app.post("/users", validate(registerSchema), userController.register);
app.get("/users/:id", authMiddleware, userController.getUserById);
app.get("/users", authMiddleware, userController.getAllUsers);
app.put(
  "/users/:id",
  authMiddleware,
  validate(updateSchema),
  userController.updateUser
);
app.delete("/users/:id", authMiddleware, userController.deleteUser);

app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    logger.info("Data Source has been initialized!");
  })
  .catch((err) => {
    logger.error("Error during Data Source initialization", err);
    process.exit(1);
  });

if (process.env.NODE_ENV !== "lambda") {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

export const handler = serverless(app);
export default app;

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticates a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful authentication. Returns a JWT token.
 *       401:
 *         description: Invalid credentials.
 *       400:
 *         description: Validation error.
 */
app.post("/login", userController.login);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Registers a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User successfully registered.
 *       400:
 *         description: Invalid data.
 */
app.post("/users", validate(registerSchema), userController.register);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users successfully returned.
 */
app.get("/users", authMiddleware, userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Returns a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID.
 *     responses:
 *       200:
 *         description: User found.
 *       404:
 *         description: User not found.
 */
app.get("/users/:id", authMiddleware, userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Updates a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: User successfully updated.
 *       404:
 *         description: User not found.
 *       400:
 *         description: Validation error.
 */
app.put(
  "/users/:id",
  authMiddleware,
  validate(updateSchema),
  userController.updateUser
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletes a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID.
 *     responses:
 *       204:
 *         description: User successfully deleted.
 *       404:
 *         description: User not found.
 */
app.delete("/users/:id", authMiddleware, userController.deleteUser);

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operations related to users
 *
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: password123
 *
 *     UpdateUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: John Updated
 *         email:
 *           type: string
 *           example: johnupdated@example.com
 *         password:
 *           type: string
 *           example: newPassword123
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
