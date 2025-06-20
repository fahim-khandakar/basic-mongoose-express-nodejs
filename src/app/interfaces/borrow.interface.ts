import { Model } from "mongoose";

export interface IBorrow {
  book: string;
  quantity: number;
  dueDate: Date;
}

export interface BorrowStaticMethods extends Model<IBorrow> {
  updateAvailableStatus(data: any): Promise<void>;
}
