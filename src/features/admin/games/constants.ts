import type { Game, GamePlatform } from "./types";

export const initialGames: Game[] = [
  { id: 1, name: "GTA V", platform: "ps", price: 1_200_000, is_active: true },
  { id: 2, name: "FIFA 24", platform: "xbox", price: 900_000, is_active: true },
  { id: 3, name: "Zelda", platform: "nintendo", price: 1_500_000, is_active: false },
];

export const platformLabels: Record<GamePlatform, string> = {
  ps: "PlayStation",
  xbox: "Xbox",
  nintendo: "Nintendo",
};

export const platformOptions: { value: string; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "ps", label: "PlayStation" },
  { value: "xbox", label: "Xbox" },
  { value: "nintendo", label: "Nintendo" },
];
