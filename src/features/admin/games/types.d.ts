export type Platform = "ps" | "xbox" | "nintendo" | "all";

export type GamePlatform = Exclude<Platform, "all">;

export interface Game {
  id: number;
  name: string;
  platform: GamePlatform;
  price: number;
  is_active: boolean;
}

export interface GameFormData {
  name: string;
  platform: GamePlatform;
  price: string;
  is_active: boolean;
}
