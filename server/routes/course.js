const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course");

/**
 * @swagger
 * /course/add:
 *  post:
 *    tags:
 *    - "/course/"
 *    summary: Add a new course
 *    parameters:
 *    - name: "body"
 *      in: "body"
 *      description: "Course's data"
 *      schema:
 *        type: "object"
 *        properties:
 *          name:
 *            type: "string"
 *          passcode:
 *            type: "string"
 *          allowedAbsences:
 *            type: "number"
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.post("/add", courseController.add);

/**
 * @swagger
 * /course/:
 *  get:
 *    tags:
 *    - "/course/"
 *    summary: Get detailed information about the course with a specified id
 *    parameters:
 *    - name: "id"
 *      in: "path"
 *      description: "Course ID"
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: An unsuccessful repsonse
 */

router.get("/:id/details", courseController.getSingle);

/**
 * @swagger
 * /course/:
 *  get:
 *    tags:
 *    - "/course/"
 *    summary: Get all courses
 *    responses:
 *      '200':
 *        description: A successful response, with all courses
 *      '400':
 *        description: An unsuccessful response
 */

router.get("/", courseController.getAll);

/**
 * @swagger
 * /course/:id:
 *  delete:
 *    tags:
 *    - "/course/"
 *    summary: Delete course with the given ID
 *    parameters:
 *    - name: "id"
 *      in: "path"
 *      description: "Course ID"
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: An unsuccessful response
 */

router.delete("/:id", courseController.delete);

/**
 * @swagger
 * /course/:id:
 *  put:
 *    tags:
 *    - "/course/"
 *    summary: Update course with the given ID
 *    parameters:
 *    - name: "id"
 *      in: "path"
 *      description: "Course ID"
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: An unsucessful response
 */

router.put("/:id", courseController.update);

module.exports = router;
