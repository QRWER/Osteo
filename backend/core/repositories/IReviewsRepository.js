class IReviewRepository {
  async createReview(reviewData) {
    throw new Error('Method not implemented');
  }

  async getApprovedReviews() {
    throw new Error('Method not implemented');
  }

  async approveReview(id) {
    throw new Error('Method not implemented');
  }

  async deleteReview(id) {
    throw new Error('Method not implemented');
  }
}

module.exports = IReviewRepository;
