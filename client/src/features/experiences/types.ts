import { Experience, User } from "@advanced-react/server/database/schema";

type ExperienceWithUser = Experience & {
  user: User;
};

type ExperienceWithCommentsCount = Experience & {
  commentsCount: number;
};
type ExperienceWithUserContext = Experience & {
  isAttending: boolean;
};

type ExperienceWithAttendeesCount = Experience & {
  attendeesCount: number;
};

type ExperienceWithAttendees = Experience & {
  attendees: User[];
};

export type ExperienceForList = ExperienceWithUser &
  ExperienceWithUserContext &
  ExperienceWithCommentsCount &
  ExperienceWithCommentsCount &
  ExperienceWithAttendeesCount;

export type ExperienceForDetails = ExperienceWithUser &
  ExperienceWithUserContext &
  ExperienceWithCommentsCount &
  ExperienceWithCommentsCount &
  ExperienceWithAttendees &
  ExperienceWithAttendeesCount;
