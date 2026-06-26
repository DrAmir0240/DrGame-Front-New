export interface SoldGame {
  gameId: string;
  gameName: string;
}

export interface AccountSale {
  id: string;
  accountId: string;
  soldGames: SoldGame[];
  createdDate: string;
}

export interface GameAccount {
  id: string;
  name: string;
}