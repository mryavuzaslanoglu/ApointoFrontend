export type StaffSummary = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  title?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  isActive: boolean;
};

export type StaffSchedule = {
  dayOfWeek: number;
  isWorking: boolean;
  startTime?: string | null;
  endTime?: string | null;
};

export type StaffAvailabilityOverride = {
  id: string;
  date: string;
  type: number;
  startTime?: string | null;
  endTime?: string | null;
  reason?: string | null;
};

export type StaffDetail = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  title?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  isActive: boolean;
  userId?: string | null;
  hiredAtUtc?: string | null;
  terminatedAtUtc?: string | null;
  schedules: StaffSchedule[];
  availabilityOverrides: StaffAvailabilityOverride[];
};

export type CreateStaffPayload = {
  firstName: string;
  lastName: string;
  title?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  isActive: boolean;
  userId?: string | null;
  hiredAtUtc?: string | null;
};

export type UpdateStaffPayload = CreateStaffPayload & {
  terminatedAtUtc?: string | null;
};

export type UpdateStaffSchedulePayload = {
  schedules: StaffSchedule[];
};

export type CreateAvailabilityOverridePayload = {
  date: string;
  type: number;
  startTime?: string | null;
  endTime?: string | null;
  reason?: string | null;
};
