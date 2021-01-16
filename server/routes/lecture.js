const express = require("express");
const router = express.Router();
const lectureController = require("../controllers/lecture");

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

router.get("/lecturesForTeacher", lectureController.getLecturesForTeacher);

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
