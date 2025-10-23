
export interface SideHustleTask {
  id: number;
  description: string;
  completed: boolean;
}

export interface SideHustlePlan {
  idea: string;
  tasks: SideHustleTask[];
}

export interface PriceReport {
  id: number;
  item: string;
  price: number;
  store: string;
  photoUrl?: string;
  distance: number; // in km
}

export interface GeminiPlanResponse {
    idea: string;
    tasks: string[];
}
