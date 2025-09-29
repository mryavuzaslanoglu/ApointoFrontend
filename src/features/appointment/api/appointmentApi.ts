import { api } from "@/shared/api/httpClient";
import type {
  Appointment,
  FindAvailableSlotsResponse,
  CalendarView,
  FindAvailableSlotsPayload,
  CreateAppointmentPayload,
  GetCustomerAppointmentsPayload,
  CancelAppointmentPayload,
  UpdateAppointmentPayload,
  GetCalendarAppointmentsPayload,
} from "@/entities/appointment/model/types";

const basePath = "/api/appointments";

export const appointmentApi = {
  findAvailableSlots: (payload: FindAvailableSlotsPayload) =>
    api.post<FindAvailableSlotsResponse>(`${basePath}/find-available-slots`, payload),

  createAppointment: (payload: CreateAppointmentPayload) =>
    api.post<Appointment>(`${basePath}`, payload),

  getMyAppointments: (params?: GetCustomerAppointmentsPayload) =>
    api.get<Appointment[]>(`${basePath}/my`, { params }),

  getAppointment: (id: string) =>
    api.get<Appointment>(`${basePath}/${id}`),

  cancelAppointment: (id: string, payload?: CancelAppointmentPayload) =>
    api.put(`${basePath}/${id}/cancel`, payload || {}),

  updateAppointment: (id: string, payload: UpdateAppointmentPayload) =>
    api.put(`${basePath}/${id}`, payload),

  getCalendarAppointments: (params: GetCalendarAppointmentsPayload) =>
    api.get<CalendarView>(`${basePath}/calendar`, { params }),
};