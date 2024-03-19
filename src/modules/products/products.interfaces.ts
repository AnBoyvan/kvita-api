export interface IFindProductsFilter {
  name?: { $regex: string; $options: string };
  category?: { $in: string[] };
  isActive?: boolean;
  isNewProduct?: boolean;
  promo?: { $gte: number };
  $or?: (
    | {
        $and: (
          | {
              price: {
                $gte: number;
                $lte?: undefined;
              };
            }
          | {
              price: {
                $lte: number;
                $gte?: undefined;
              };
            }
        )[];
      }
    | {
        $and: (
          | {
              promoPrice?: {
                $gte: number;
                $lte?: undefined;
              };
            }
          | {
              promoPrice?: {
                $lte: number;
                $gte?: undefined;
              };
            }
        )[];
      }
  )[];
  createdAt?: { $gte: Date; $lte: Date };
  updatedAt?: { $gte: Date; $lte: Date };
}
