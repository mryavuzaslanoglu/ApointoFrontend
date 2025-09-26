import { api } from "@/shared/api/httpClient";
import type {
  CreateAvailabilityOverridePayload,
  CreateStaffPayload,
  StaffAvailabilityOverride,
  StaffDetail,
  StaffSchedule,
  StaffSummary,
  UpdateStaffPayload,
  UpdateStaffSchedulePayload,
} from "@/entities/staff/model";

const basePath = "/api/staff";

export const staffApi = {
  getStaffList: async () => {
    const response = await api.get<StaffSummary[]>(basePath);
    return response.data;
  },
  getStaffById: async (id: string) => {
    const response = await api.get<StaffDetail>(`${basePath}/${id}`);
    return response.data;
  },
  createStaff: async (payload: CreateStaffPayload) => {
    const response = await api.post<StaffDetail>(basePath, payload);
    return response.data;
  },
  updateStaff: async (id: string, payload: UpdateStaffPayload) => {
    const response = await api.put<StaffDetail>(`${basePath}/${id}`, payload);
    return response.data;
  },
  deleteStaff: async (id: string) => {
    await api.delete(`${basePath}/${id}`);
  },
  getSchedule: async (id: string) => {
    const response = await api.get<StaffSchedule[]>(`${basePath}/${id}/schedule`);
    return response.data;
  },
  updateSchedule: async (id: string, payload: UpdateStaffSchedulePayload) => {
    const response = await api.put<StaffSchedule[]>(`${basePath}/${id}/schedule`, payload);
    return response.data;
  },
  getAvailabilityOverrides: async (id: string) => {
    const response = await api.get<StaffAvailabilityOverride[]>(`${basePath}/${id}/availability-overrides`);
    return response.data;
  },
  createAvailabilityOverride: async (id: string, payload: CreateAvailabilityOverridePayload) => {
    const response = await api.post<StaffAvailabilityOverride>(`${basePath}/${id}/availability-override`, payload);
    return response.data;
  },
  deleteAvailabilityOverride: async (id: string, overrideId: string) => {
    await api.delete(`${basePath}/${id}/availability-override/${overrideId}`);
  },
};
