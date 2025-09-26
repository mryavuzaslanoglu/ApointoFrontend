import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import type {
  CreateAvailabilityOverridePayload,
  CreateStaffPayload,
  StaffDetail,
  StaffSchedule,
  StaffSummary,
  UpdateStaffPayload,
  UpdateStaffSchedulePayload,
} from "@/entities/staff/model";
import { staffApi } from "@/features/staff/api/staffApi";

export function useStaffManagement() {
  const [staffMembers, setStaffMembers] = useState<StaffSummary[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffDetail | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadStaffList = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const list = await staffApi.getStaffList();
      setStaffMembers(list);
      if (list.length > 0 && !selectedStaffId) {
        setSelectedStaffId(list[0].id);
      }
    } catch (error) {
      toast.error("Personel listesi yüklenemedi.");
    } finally {
      setIsLoadingList(false);
    }
  }, [selectedStaffId]);

  const loadStaffDetail = useCallback(
    async (id: string) => {
      setIsLoadingDetail(true);
      try {
        const detail = await staffApi.getStaffById(id);
        setSelectedStaff(detail);
      } catch (error) {
        toast.error("Personel detayý yüklenemedi.");
      } finally {
        setIsLoadingDetail(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadStaffList();
  }, [loadStaffList]);

  useEffect(() => {
    if (selectedStaffId) {
      void loadStaffDetail(selectedStaffId);
    } else {
      setSelectedStaff(null);
    }
  }, [selectedStaffId, loadStaffDetail]);

  const selectStaff = useCallback((id: string) => {
    setSelectedStaffId(id);
  }, []);

  const createStaff = useCallback(
    async (payload: CreateStaffPayload) => {
      setIsSaving(true);
      try {
        const created = await staffApi.createStaff(payload);
        toast.success("Personel eklendi.");
        await loadStaffList();
        setSelectedStaffId(created.id);
      } catch (error) {
        toast.error("Personel eklenemedi.");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [loadStaffList]
  );

  const updateStaff = useCallback(
    async (id: string, payload: UpdateStaffPayload) => {
      setIsSaving(true);
      try {
        const updated = await staffApi.updateStaff(id, payload);
        toast.success("Personel güncellendi.");
        setStaffMembers((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
        setSelectedStaff(updated);
      } catch (error) {
        toast.error("Personel güncellenemedi.");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const deleteStaff = useCallback(
    async (id: string) => {
      setIsSaving(true);
      try {
        await staffApi.deleteStaff(id);
        toast.success("Personel silindi.");
        setStaffMembers((prev) => prev.filter((item) => item.id !== id));
        if (selectedStaffId === id) {
          setSelectedStaffId(null);
          setSelectedStaff(null);
        }
      } catch (error) {
        toast.error("Personel silinemedi.");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [selectedStaffId]
  );

  const updateSchedule = useCallback(
    async (id: string, payload: UpdateStaffSchedulePayload) => {
      setIsSaving(true);
      try {
        const schedules = await staffApi.updateSchedule(id, payload);
        toast.success("Çalýþma takvimi güncellendi.");
        setSelectedStaff((prev) => (prev ? { ...prev, schedules } : prev));
      } catch (error) {
        toast.error("Çalýþma takvimi güncellenemedi.");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const createAvailabilityOverride = useCallback(
    async (id: string, payload: CreateAvailabilityOverridePayload) => {
      setIsSaving(true);
      try {
        const override = await staffApi.createAvailabilityOverride(id, payload);
        toast.success("Ýzin kaydý oluþturuldu.");
        setSelectedStaff((prev) =>
          prev ? { ...prev, availabilityOverrides: [override, ...prev.availabilityOverrides] } : prev
        );
      } catch (error) {
        toast.error("Ýzin kaydý oluþturulamadý.");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const deleteAvailabilityOverride = useCallback(
    async (id: string, overrideId: string) => {
      setIsSaving(true);
      try {
        await staffApi.deleteAvailabilityOverride(id, overrideId);
        toast.success("Ýzin kaydý silindi.");
        setSelectedStaff((prev) =>
          prev
            ? {
                ...prev,
                availabilityOverrides: prev.availabilityOverrides.filter((item) => item.id !== overrideId),
              }
            : prev
        );
      } catch (error) {
        toast.error("Ýzin kaydý silinemedi.");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const selectedSchedules = useMemo<StaffSchedule[]>(() => selectedStaff?.schedules ?? [], [selectedStaff]);

  return {
    staffMembers,
    selectedStaff,
    selectedStaffId,
    isLoadingList,
    isLoadingDetail,
    isSaving,
    selectStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    updateSchedule,
    createAvailabilityOverride,
    deleteAvailabilityOverride,
    selectedSchedules,
  };
}
