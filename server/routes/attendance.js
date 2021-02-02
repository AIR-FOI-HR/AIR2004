const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /attendance/add:
 *  post:
 *    tags:
 *    - "/attendance/"
 *    summary: Add a new attendance
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      description: "Attendance's data"
 *      schema:
 *        type: "object"
 *        properties:
 *          lecture:
 *            type: "string"
 *          user:
 *            type: "string"
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post("/add", attendanceController.add);

/**
 * @swagger
 * /attendance/:
 *  get:
 *    tags:
 *    - "/attendance/"
 *    summary: Get all attendances by student
 *    responses:
 *      '200':
 *        description: A successful response, with all attendances for a given student
 *      '400':
 *        description: An unsuccessful response
 */
router.get("/by-student", auth, attendanceController.getAllByStudent);

/**
 * @swagger
 * /attendance/:
 *  get:
 *    tags:
 *    - "/attendance/"
 *    summary: Get all attendances
 *    responses:
 *      '200':
 *        description: A successful response, with all attendances
 *      '400':
 *        description: An unsuccessful response
 */
router.get("/", auth, attendanceController.getAll);

/**
 * @swagger
 * /attendance/mark:
 *  post:
 *    tags:
 *    - "/attendance/"
 *    summary: Mark attendance
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      description: "Attendance's data"
 *      schema:
 *        type: "object"
 *        properties:
 *          code:
 *            type: "string"
 *          user:
 *            type: "string"
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post("/mark", attendanceController.markAttendance);

/**
 * @swagger
 * /attendance/delete/:id:
 *  delete:
 *    tags:
 *    - "/attendance/"
 *    summary: Delete attendance
 *    parameters:
 *    - name: "id"
 *      in: "path"
 *      description: "Attendance ID"
 *    responses:
 *      '200':
 *        description: A successful response, denoting that the attendance has been successfully deleted
 *      '400':
 *        description: An unsuccessful response
 */
router.delete("/:id", attendanceController.delete);

/**
 * @swagger
 * /attendance/missed:
 *  get:
 *    tags:
 *    - "/attendance/"
 *    summary: Get missed attendances
 *    responses:
 *      '200':
 *        description: A successful response with all missed attendances
 *      '400':
 *        description: An unsuccessful response
 */
router.get("/missed", auth, attendanceController.getMissed);

module.exports = router;
