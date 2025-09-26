import { api } from "@/shared/api/httpClient";
import type {
  CreateServiceCategoryPayload,
  CreateServicePayload,
  ServiceCategory,
  ServiceItem,
  UpdateServiceCategoryPayload,
  UpdateServicePayload,
} from "@/entities/service/model";

const categoryPath = "/api/service-categories";
const servicePath = "/api/services";

export const servicesApi = {
  getCategories: async () => {
    const response = await api.get<ServiceCategory[]>(categoryPath);
    return response.data;
  },
  createCategory: async (payload: CreateServiceCategoryPayload) => {
    const response = await api.post<ServiceCategory>(categoryPath, payload);
    return response.data;
  },
  updateCategory: async (id: string, payload: UpdateServiceCategoryPayload) => {
    const response = await api.put<ServiceCategory>(`${categoryPath}/${id}`, payload);
    return response.data;
  },
  deleteCategory: async (id: string) => {
    await api.delete(`${categoryPath}/${id}`);
  },
  getServices: async () => {
    const response = await api.get<ServiceItem[]>(servicePath);
    return response.data;
  },
  getServiceById: async (id: string) => {
    const response = await api.get<ServiceItem>(`${servicePath}/${id}`);
    return response.data;
  },
  createService: async (payload: CreateServicePayload) => {
    const response = await api.post<ServiceItem>(servicePath, payload);
    return response.data;
  },
  updateService: async (id: string, payload: UpdateServicePayload) => {
    const response = await api.put<ServiceItem>(`${servicePath}/${id}`, payload);
    return response.data;
  },
  deleteService: async (id: string) => {
    await api.delete(`${servicePath}/${id}`);
  },
};
