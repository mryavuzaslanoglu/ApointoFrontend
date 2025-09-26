import type { StaffSummary } from "@/entities/staff/model";

export type ServiceCategory = {
  id: string;
  name: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
};

export type ServiceItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  durationInMinutes: number;
  bufferTimeInMinutes: number;
  isActive: boolean;
  colorHex?: string | null;
  categoryId: string;
  categoryName: string;
  assignedStaff: StaffSummary[];
};

export type CreateServiceCategoryPayload = {
  name: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
};

export type UpdateServiceCategoryPayload = CreateServiceCategoryPayload;

export type CreateServicePayload = {
  name: string;
  description?: string | null;
  price: number;
  durationInMinutes: number;
  bufferTimeInMinutes: number;
  isActive: boolean;
  colorHex?: string | null;
  categoryId: string;
  staffIds: string[];
};

export type UpdateServicePayload = CreateServicePayload;
