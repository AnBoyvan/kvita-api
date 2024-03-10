export interface IFindProductsFilter {
  name?: { $regex: string; $options: string };
  category?: { $in: string[] };
  isActive?: boolean;
  isNewProduct?: boolean;
  promo?: { $gte: number };
  $or?: { [key: string]: { $gte: number; $lte: number } }[];
  createdAt?: { $gte: Date; $lte: Date };
  updatedAt?: { $gte: Date; $lte: Date };
}
