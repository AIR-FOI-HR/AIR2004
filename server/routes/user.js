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
 * /user/assignCourse:
 *  post:
 *    tags:
 *    - "/user/"
 *    summary: Assign a course to a teacher
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
 *        description: An object containing the both the newly modified teacher and the course
 *      '400':
 *        description: An unsuccessful response
 */

router.post("/assignCourse", userController.assignCourse);

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
 * /user/resetPassword:
 *  post:
 *    tags:
 *    - "/user/"
 *    summary: Reset a user's (student/teacher) password
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      description: "Email used to register"
 *      schema:
 *        type: "object"
 *        properties:
 *          email:
 *            type: "string"
 *    responses:
 *      '200':
 *        description: An successful response
 *      '400':
 *        description: An unsuccessful response containing the error description
 */

router.post("/resetPassword", userController.resetPassword);

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
 * /user/details:
 *  get:
 *    tags:
 *    - "/user/"
 *    summary: Get detailed information about the user
 *    responses:
 *      '200':
 *        description: Detailed information about the requested user
 *      '400':
 *        description: An unsuccessful request
 */

router.get("/details", userController.getSingle);

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

/**
 * @swagger
 * /user/:
 *  delete:
 *    tags:
 *    - "/user/"
 *    summary: Delete user with the given ID
 *    parameters:
 *    - name: "id"
 *      in: "path"
 *      description: "User ID"
 *    responses:
 *      '200':
 *        description: A successful response
 * /user/:id
 *  delete:
 *    tags:
 *    - "/user/"
 *    summary: Delete user by id
 */

router.delete("/:id", userController.delete);

/** @swagger
* /user/:
*  update:
*    tags:
*    - "/user/"
*    summary: Update user with the given ID
*    parameters:
*    - name: "id"
*      in: "path"
*      description: "User ID"
*    responses:
*      '200':
*        description: A successful response
* /user/update/:id
*  update:
*    tags:
*    - "/user/"
*    summary: Update user by id
*/

router.post("/update/:id", userController.update);

router.put("/reset-uid/:id", userController.resetUID);

module.exports = router;
