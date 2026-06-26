import { AccountSale, GameAccount } from "./types";

export const mockAccounts: GameAccount[] = [
  {
    id: "1",
    name: "PS Premium Account #01",
  },
  {
    id: "2",
    name: "Xbox Game Pass Ultimate",
  },
  {
    id: "3",
    name: "Nintendo Family Account",
  },
];

export const mockAccountSales: AccountSale[] = [
  {
    id: "1",
    accountId: "1",
    createdDate: "2025-08-18T14:20:00",
    soldGames: [
      {
        gameId: "g1",
        gameName: "EA FC 25",
      },
      {
        gameId: "g2",
        gameName: "God of War Ragnarök",
      },
    ],
  },
  {
    id: "2",
    accountId: "2",
    createdDate: "2025-08-17T10:15:00",
    soldGames: [
      {
        gameId: "g3",
        gameName: "Forza Horizon 5",
      },
    ],
  },
  {
    id: "3",
    accountId: "3",
    createdDate: "2025-08-16T19:45:00",
    soldGames: [
      {
        gameId: "g4",
        gameName: "Zelda: Tears of the Kingdom",
      },
      {
        gameId: "g5",
        gameName: "Mario Kart 8 Deluxe",
      },
    ],
  },
];