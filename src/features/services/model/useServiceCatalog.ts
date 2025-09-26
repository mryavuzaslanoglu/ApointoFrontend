import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import type {
  CreateServiceCategoryPayload,
  CreateServicePayload,
  ServiceCategory,
  ServiceItem,
  UpdateServiceCategoryPayload,
  UpdateServicePayload,
} from "@/entities/service/model";
import { servicesApi } from "@/features/services/api/servicesApi";

export function useServiceCatalog() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [categoryList, serviceList] = await Promise.all([
        servicesApi.getCategories(),
        servicesApi.getServices(),
      ]);
      setCategories(categoryList);
      setServices(serviceList);
      if (serviceList.length > 0 && !selectedServiceId) {
        setSelectedServiceId(serviceList[0].id);
      }
    } catch (error) {
      toast.error("Hizmet verileri y�klenemedi.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedServiceId]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const createCategory = useCallback(async (payload: CreateServiceCategoryPayload) => {
    setIsSaving(true);
    try {
      const created = await servicesApi.createCategory(payload);
      setCategories((prev) => [...prev, created]);
      toast.success("Kategori olu�turuldu.");
    } catch (error) {
      toast.error("Kategori olu�turulamad�.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, payload: UpdateServiceCategoryPayload) => {
    setIsSaving(true);
    try {
      const updated = await servicesApi.updateCategory(id, payload);
      setCategories((prev) => prev.map((item) => (item.id === id ? updated : item)));
      toast.success("Kategori g�ncellendi.");
    } catch (error) {
      toast.error("Kategori g�ncellenemedi.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setIsSaving(true);
    try {
      await servicesApi.deleteCategory(id);
      setCategories((prev) => prev.filter((item) => item.id !== id));
      toast.success("Kategori silindi.");
    } catch (error) {
      toast.error("Kategori silinemedi. �nce kategoriye ba�l� hizmetleri kald�r�n.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const createService = useCallback(async (payload: CreateServicePayload) => {
    setIsSaving(true);
    try {
      const created = await servicesApi.createService(payload);
      setServices((prev) => [...prev, created]);
      setSelectedServiceId(created.id);
      toast.success("Hizmet olu�turuldu.");
    } catch (error) {
      toast.error("Hizmet olu�turulamad�.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateService = useCallback(async (id: string, payload: UpdateServicePayload) => {
    setIsSaving(true);
    try {
      const updated = await servicesApi.updateService(id, payload);
      setServices((prev) => prev.map((item) => (item.id === id ? updated : item)));
      toast.success("Hizmet g�ncellendi.");
    } catch (error) {
      toast.error("Hizmet g�ncellenemedi.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteService = useCallback(async (id: string) => {
    setIsSaving(true);
    try {
      await servicesApi.deleteService(id);
      setServices((prev) => prev.filter((item) => item.id !== id));
      if (selectedServiceId === id) {
        setSelectedServiceId(null);
      }
      toast.success("Hizmet silindi.");
    } catch (error) {
      toast.error("Hizmet silinemedi.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [selectedServiceId]);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? null,
    [services, selectedServiceId]
  );

  return {
    categories,
    services,
    selectedServiceId,
    selectedService,
    isLoading,
    isSaving,
    setSelectedServiceId,
    createCategory,
    updateCategory,
    deleteCategory,
    createService,
    updateService,
    deleteService,
  };
}
