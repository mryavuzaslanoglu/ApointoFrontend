export type AppointmentStatus =
  | "Scheduled"
  | "Confirmed"
  | "InProgress"
  | "Completed"
  | "Cancelled"
  | "NoShow"
  | "Rescheduled";

export type AppointmentService = {
  serviceId: string;
  serviceName: string;
  price: number;
  durationInMinutes: number;
};

export type Appointment = {
  id: string;
  customerId: string;
  staffId: string;
  staffName: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: AppointmentStatus;
  notes?: string | null;
  services: AppointmentService[];
};

export type AvailableSlot = {
  startTime: string;
  endTime: string;
  staffId: string;
  staffName: string;
  isAvailable: boolean;
};

export type FindAvailableSlotsResponse = {
  searchDate: string;
  totalDurationInMinutes: number;
  availableSlots: AvailableSlot[];
};

export type CalendarAppointment = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  staffId: string;
  staffName: string;
  customerId: string;
  customerName: string;
  status: AppointmentStatus;
  totalPrice: number;
  notes?: string | null;
  serviceNames: string[];
  colorHex?: string | null;
};

export type StaffCalendarInfo = {
  id: string;
  name: string;
  colorHex?: string | null;
};

export type CalendarView = {
  startDate: string;
  endDate: string;
  appointments: CalendarAppointment[];
  staff: StaffCalendarInfo[];
};

// Request types
export type FindAvailableSlotsPayload = {
  serviceIds: string[];
  preferredStaffId?: string | null;
  startDate: string;
  endDate: string;
};

export type CreateAppointmentPayload = {
  staffId: string;
  startTimeUtc: string;
  serviceIds: string[];
  notes?: string | null;
};

export type GetCustomerAppointmentsPayload = {
  includePast?: boolean;
  pageNumber?: number;
  pageSize?: number;
};

export type CancelAppointmentPayload = {
  cancellationReason?: string | null;
};

export type UpdateAppointmentPayload = {
  newStartTimeUtc?: string | null;
  newEndTimeUtc?: string | null;
  newStaffId?: string | null;
  notes?: string | null;
  status?: AppointmentStatus | null;
};

export type GetCalendarAppointmentsPayload = {
  startDate: string;
  endDate: string;
  staffIds?: string[] | null;
};