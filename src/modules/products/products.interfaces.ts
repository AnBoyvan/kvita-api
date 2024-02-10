export interface IFindProductsFilter {
  $or?: { [key: string]: { $regex: string; $options: string } }[];
  category?: { $in: string[] };
  isActive?: boolean;
  isNewProduct?: boolean;
  createdAt?: { $gte: Date; $lte: Date };
  updatedAt?: { $gte: Date; $lte: Date };
}
