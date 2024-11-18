export interface IUser {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: Date;
}

export interface ITender {
  id: string;
  userId: string;
  title: string;
  description: string;
  amount: number;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  winningBidId: string | null;
  winningBid?: IBid;
  bids?: IBid[];
}

export interface ITenderVendor extends ITender {
  bids: undefined;
  user?: IUser;
}

export interface IBid {
  id: string;
  userId: string;
  tenderId: string;
  bidAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
}
