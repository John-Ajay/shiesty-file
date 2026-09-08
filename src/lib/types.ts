export type Operative = {
  id: string;
  operative_number: number;
  x_handle: string;
  stripes: number;
  rank: string;
  clearance_level: number;
  missions_completed: number;
  created_at: string;
  updated_at: string;
};

export type MissionRow = {
  id: string;
  mission_number: string;
  title: string;
  description: string;
  stripe_reward: number;
  active: boolean;
  created_at: string;
};

export type OperativeMission = {
  id: string;
  operative_id: string;
  mission_id: string;
  completed: boolean;
  completed_at: string | null;
};
