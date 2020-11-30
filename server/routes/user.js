const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

/**
 * @swagger
 * /user/login:
 *  post:
 *    tags:
 *    - "/user/"
 *    summary: Sign in the application
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      description: "Account's email address and password"
 *      schema:
 *        type: "object"
 *        properties:
 *          email:
 *            type: "string"
 *          password:
 *            type: "string"
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /user/login/tablet:
 *  post:
 *    tags:
 *    - "/user/"
 *    summary: Route which is called by the mobile application when teacher scans the sign in QR code that is generated on the tablet
 *    parameters:
 *    - token: "body"
 *      in: "body"
 *      description: "Authentication token that had been read out from the scanned authentication QR code"
 *      schema:
 *        type: "object"
 *        properties:
 *          token:
 *            type: "string"
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post("/login/tablet", userController.loginTablet);

/**
 * @swagger
 * /user/enroll:
 *  post:
 *    tags:
 *    - "/user/"
 *    summary: Enroll a student into a specified course
 *    parameters:
 *    - in: header
 *      name: Bearer
 *      description: User token
 *    - name: "body"
 *      in: "body"
 *      description: "Course join passcode"
 *      schema:
 *        type: "object"
 *        properties:
 *          passcode:
 *            type: "string"
 *    responses:
 *      '200':
 *        description: An object containing the both the newly modified student and the course
 *      '400':
 *        description: An unsuccessful response
 */
router.post("/enroll", userController.enroll);

/**
 * @swagger
 * /user/verify:
 *  post:
 *    tags:
 *    - "/user/"
 *    summary: Verify user's JWT
 *  parameters:
 *   - name: "body"
 *     in: "body"
 *     description: "JWT to verify"
 *     schema:
 *       type: "object"
 *       properties:
 *         token:
 *           type: "string"
 *     responses:
 *      '200':
 *        description: A successful response
 */
router.get("/verify", userController.verify);

/**
 * @swagger
 * /user/{role}/register:
 *  post:
 *    tags:
 *    - "/user/"
 *    summary: Register a new account with the provided role
 *    parameters:
 *    - name: "role"
 *      in: "path"
 *      description: "User's role"
 *      schema:
 *        type: "string"
 *        enum: [student, teacher]
 *    - name: "body"
 *      in: "body"
 *      description: "Account's data"
 *      schema:
 *        type: "object"
 *        properties:
 *          email:
 *            type: "string"
 *          password:
 *            type: "string"
 *          jmbag:
 *            type: "string"
 *          phoneNumber:
 *            type: "string"
 *          userType:
 *            type: "string"
 *            enum: [student, teacher, admin]
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post("/:role/register", userController.register);

/**
 * @swagger
 * /user/{id}/details:
 *  get:
 *    tags:
 *    - "/user/"
 *    summary: Get detailed information about the user with a specified id
 *    responses:
 *      '200':
 *        description: Detailed information about the requested user
 *      '400':
 *        description: An unsuccessful request
 */
router.get("/:id/details", userController.getSingle);

/**
 * @swagger
 * /user/{role}:
 *  get:
 *    tags:
 *    - "/user/"
 *    summary: Get all users that have the provided role
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/:role", userController.getAllUsers);

module.exports = router;
