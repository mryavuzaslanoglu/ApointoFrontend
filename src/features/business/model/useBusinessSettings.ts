import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { BusinessSettings, UpdateBusinessSettingsPayload } from "@/entities/business/model";
import { businessApi } from "@/features/business/api/businessApi";

export function useBusinessSettings() {
  const [data, setData] = useState<BusinessSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const settings = await businessApi.getSettings();
      setData(settings);
    } catch (error) {
      toast.error("Ýþletme ayarlarý yüklenirken bir hata oluþtu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(
    async (payload: UpdateBusinessSettingsPayload) => {
      setIsSaving(true);
      try {
        const updated = await businessApi.updateSettings(payload);
        setData(updated);
        toast.success("Ýþletme ayarlarý güncellendi.");
      } catch (error) {
        toast.error("Ýþletme ayarlarý kaydedilemedi.");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  return { data, isLoading, isSaving, refresh: load, save };
}
