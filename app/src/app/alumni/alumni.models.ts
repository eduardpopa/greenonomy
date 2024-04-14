export interface Record {
  name: string;
  fromDate?: Date | null | undefined;
  toDate?: Date | null | undefined;
}
export interface Alumn {
  id?: string;
  firstName: string;
  lastName: string;
  workplaces?: Record[];
  studies?: Record[];
  description?: string | null | undefined;
}
