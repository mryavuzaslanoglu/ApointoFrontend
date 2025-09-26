import { api } from "@/shared/api/httpClient";
import type { BusinessSettings, UpdateBusinessSettingsPayload } from "@/entities/business/model";

const basePath = "/api/business";

export const businessApi = {
  getSettings: async () => {
    const response = await api.get<BusinessSettings>(`${basePath}/settings`);
    return response.data;
  },
  updateSettings: async (payload: UpdateBusinessSettingsPayload) => {
    const response = await api.put<BusinessSettings>(`${basePath}/settings`, payload);
    return response.data;
  },
};
