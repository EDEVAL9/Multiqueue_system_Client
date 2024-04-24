export interface TutorI {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  accountType: "STUDENT" | "TUTOR";
  status: "ACTIVE" | "PENDING ACTIVATION" | "INACTIVE";
  msGraphAccessToken?: string;
  msGraphRefreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
