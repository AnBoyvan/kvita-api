export interface IFindUsersFilter {
  role?: { $in: string[] };
  $or?: { [key: string]: { $regex: string; $options: string } }[];
  phone?: { $regex: string; $options: string };
  email?: { $regex: string; $options: string };
  verify?: boolean;
  discount?: { $gte: number; $lte: number };
  createdAt?: { $gte: Date; $lte: Date };
}
