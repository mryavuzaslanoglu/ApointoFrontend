export type OperatingHour = {
  dayOfWeek: number;
  isClosed: boolean;
  openTime?: string | null;
  closeTime?: string | null;
};

export type BusinessAddress = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

export type BusinessSettings = {
  id: string;
  name: string;
  description?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  address?: BusinessAddress | null;
  operatingHours: OperatingHour[];
};

export type UpdateBusinessSettingsPayload = {
  name: string;
  description?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  address?: BusinessAddress | null;
  operatingHours: OperatingHour[];
};
