class ReviewService {
  constructor(reviewRepo) {
    this.reviewRepo = reviewRepo;
  }

  async createReview(reviewData) {
    if (!reviewData.client_name || !reviewData.text || !reviewData.rating) {
      throw new Error('Все поля обязательны: имя, текст, рейтинг');
    }

    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Рейтинг должен быть от 1 до 5');
    }

    const review = await this.reviewRepo.createReview(reviewData);
    return { id: review.id, message: 'Отзыв отправлен на модерацию' };
  }

  async getApprovedReviews() {
    return await this.reviewRepo.getApprovedReviews();
  }

  async approveReview(id) {
    const result = await this.reviewRepo.approveReview(id);
    if (!result.updated) throw new Error('Отзыв не найден');
    return { message: 'Отзыв успешно одобрен' };
  }

  async deleteReview(id) {
    const result = await this.reviewRepo.deleteReview(id);
    if (!result.deleted) throw new Error('Отзыв не найден');
    return { message: 'Отзыв удалён' };
  }
}

module.exports = ReviewService;
