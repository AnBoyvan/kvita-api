export interface IFindReviewsFilter {
  productId?: { $regex: string; $options: string };
  ownerId?: { $regex: string; $options: string };
}
