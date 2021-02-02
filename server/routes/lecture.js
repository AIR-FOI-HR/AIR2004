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
 * /lecture/:id
 *  delete:
 *    tags:
 *    - "/lecture/"
 *    summary: Delete lecture by id
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
 * /lecture/update/:id
 *  update:
 *    tags:
 *    - "/lecture/"
 *    summary: Update lecture by id
 */

router.post("/update/:id", lectureController.update);

module.exports = router;
