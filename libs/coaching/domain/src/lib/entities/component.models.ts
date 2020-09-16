import { Exercise, Session, SessionItem } from '@bod/shared/models';

export interface SessionItemData {
  sessionItem: SessionItem;
  exercise: Exercise;
}

export interface ProgramBoardData {
  sessions: Session[];
  exercises: Exercise[];
  sessionItems: SessionItem[];
}

export interface BoardCardData {
  sessionItem: SessionItem;
  exercise: Exercise;
}
