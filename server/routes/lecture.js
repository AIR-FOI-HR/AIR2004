const express = require("express");
const router = express.Router();
const lectureController = require("../controllers/lecture");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /lecture/add:
 *  post:
 *    tags:
 *    - "/lecture/"
 *    summary: Add a new lecture
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      description: "Lecture's data"
 *      schema:
 *        type: "object"
 *        properties:
 *          course:
 *            type: "number"
 *          type:
 *            type: "string"
 *          time start:
 *            type: "date"
 *          time end:
 *            type: "date"
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.post("/add", lectureController.add);

/**
 * @swagger
 * /lecture/lecturesForTeacher:
 *  get:
 *    tags:
 *    - "/lecture/"
 *    summary: Get all past lectures of courses that have been assigned to a given teacher
 *    parameters:
 *    - in: header
 *      name: Bearer
 *      description: User token
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: An unsuccessful response
 */

router.get(
  "/lecturesForTeacher",
  auth,
  lectureController.getLecturesForTeacher
);

/**
 * @swagger
 * /lecture/studentsForLecture:
 *  post:
 *    tags:
 *    - "/lecture/"
 *    summary: Fetch all students that have attended a given lecture
 *    parameters:
 *    - in: header
 *      name: Bearer
 *      description: User token
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: An unsuccessful response
 */

router.post("/studentsForLecture", lectureController.studentsForLecture);

/**
 * @swagger
 * /lecture/:
 *  get:
 *    tags:
 *    - "/lecture/"
 *    summary: Get all lectures
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.get("/", lectureController.getAll);

module.exports = router;
