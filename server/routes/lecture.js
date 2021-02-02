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
 *            type: "string"
 *          type:
 *            type: "string"
 *          timeStart:
 *            type: "date"
 *          timeEnd:
 *            type: "date"
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: An unsuccessful response
 */

router.post("/add", lectureController.add);

/**
 * @swagger
 * /lecture/lecturesForTeacher:
 *  get:
 *    tags:
 *    - "/lecture/"
 *    summary: Get all past lectures of courses that have been assigned to a given teacher
 *    responses:
 *      '200':
 *        description: A successful response, containing past lectures for the given teacher
 *      '400':
 *        description: An unsuccessful response
 */

router.get("/lecturesForTeacher", auth, lectureController.getLecturesForTeacher);

/**
 * @swagger
 * /lecture/studentsForLecture:
 *  post:
 *    tags:
 *    - "/lecture/"
 *    summary: Fetch all students that have attended a given lecture
 *    responses:
 *      '200':
 *        description: A successful response, containing all students that have attended a given lecture
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
 *        description: A list of all lectures
 *      '400':
 *        description: An unsuccessful response
 */

router.get("/", lectureController.getAll);

/**
 * @swagger
 * /lecture/:
 *  delete:
 *    tags:
 *    - "/lecture/"
 *    summary: Delete lecture with the given ID
 *    parameters:
 *    - name: "id"
 *      in: "path"
 *      description: "Lecture ID"
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: An unsuccessful response
 */

router.delete("/:id", lectureController.delete);

/**
 * @swagger
 * /lecture/:
 *  update:
 *    tags:
 *    - "/lecture/"
 *    summary: Update lecture with the given ID
 *    parameters:
 *    - name: "id"
 *      in: "path"
 *      description: "Lecture ID"
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: An unsuccessful response
 */

router.post("/update/:id", lectureController.update);

module.exports = router;
