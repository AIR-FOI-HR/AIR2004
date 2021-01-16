const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance");

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
 *    summary: Get all attendances
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/", attendanceController.getAll);

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
router.delete("/:id", attendanceController.delete);
router.get("/missed", attendanceController.getMissed)

module.exports = router;
