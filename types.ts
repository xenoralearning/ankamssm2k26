
export interface Department {
  id: string;
  name: string;
  totalPoints: number;
  gold: number;
  silver: number;
  bronze: number;
  lastUpdated: number;
}

export interface AdminUser {
  username: string;
  isLoggedIn: boolean;
}

export const INITIAL_DEPARTMENTS: string[] = [
  "Computer Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Automobile Engineering",
  "Electronics Engineering",
  "Electrical and Electronics Engineering",
  "Computer Science & Chemical Engineering",
  "Electrical Engineering & Electric Vehicle Technology + Civil Engineering & Planning"
];
