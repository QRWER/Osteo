const express = require('express');
const router = express.Router();

module.exports = (reviewController) => {
  router.post('/', (req, res) => reviewController.create(req, res));
  router.get('/', (req, res) => reviewController.getApproved(req, res));
  router.put('/approve/:id', (req, res) => reviewController.approve(req, res));
  router.delete('/:id', (req, res) => reviewController.delete(req, res));

  return router;
};
