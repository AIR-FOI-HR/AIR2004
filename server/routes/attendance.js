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
router.post("/add", auth, attendanceController.add);

/**
 * @swagger
 * /attendance/:
 *  get:
 *    tags:
 *    - "/attendance/"
 *    summary: Get all attendances by student
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/by-student", attendanceController.getAllByStudent);

/**
 * @swagger
 * /attendance/:
 *  get:
 *    tags:
 *    - "/attendance/"
 *    summary: Get all attendances
 *    responses:
 *      '200':
 *        description: A successful response
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
 *  post:
 *    tags:
 *    - "/attendance/"
 *    summary: Delete attendance
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
router.delete("/:id", attendanceController.delete);

/**
 * @swagger
 * /attendance/missed:
 *  post:
 *    tags:
 *    - "/attendance/"
 *    summary: Get missed attendances
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
router.get("/missed", attendanceController.getMissed);

module.exports = router;
