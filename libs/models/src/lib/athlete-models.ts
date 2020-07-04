export interface SessionItemStatistic {
  id?: number;
  sessionItem: number; // SessionItem
  setStatistics: number[], // SetStatistic[]
  rpe: number; // 8
  notes: string; // 'not at my full strength'
}

export interface SetStatistic {
  id?: number;
  set: number; // 1
  reps: number; // 8
  weight: number; // 35
  weightUnit: string; // lbs
}

export interface SessionStatistic {
  id?: number;
  session: number; // Session
  sessionItemStatistics: number[]; // SessionItemStatistic[]
}

export interface WeekStatistic {
  id?: number;
  week: number; // Week
  sessionStatistics: number[]; // SessionStatistic[]
}

export interface ProgramStatistic {
  id?: number;
  program: number; // Program
  weekStatistics: number[]; // WeekStatistic[]
}

export interface Playlist {
  id?: number;
  url: string; // https://www.youtube.com/playlist?list=PLu0SKb668nMfYcyc_Mpv1tcywXh2AJapj
  week: number; // Week
}
