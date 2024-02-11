export interface IFindOrdersFilter {
  'items.productId'?: string;
  status?: { $in: string[] };
  total?: { $gte: number; $lte: number };
  'customer.id'?: string;
  delivery?: boolean;
  paid?: boolean;
  createdAt?: { $gte: Date; $lte: Date };
}
