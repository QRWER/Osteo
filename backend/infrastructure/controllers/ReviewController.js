class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }

  async create(req, res) {
    try {
      const result = await this.reviewService.createReview(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getApproved(req, res) {
    try {
      const reviews = await this.reviewService.getApprovedReviews();
      res.json({ reviews });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async approve(req, res) {
    try {
      const { id } = req.params;
      const result = await this.reviewService.approveReview(id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await this.reviewService.deleteReview(id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ReviewController;
