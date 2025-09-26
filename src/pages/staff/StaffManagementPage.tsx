import { useMemo, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  type CreateAvailabilityOverridePayload,
  type CreateStaffPayload,
  type StaffAvailabilityOverride,
  type StaffDetail,
  type StaffSchedule,
  type StaffSummary,
  type UpdateStaffPayload,
} from "@/entities/staff/model";
import { useStaffManagement } from "@/features/staff/model";

const staffSchema = Yup.object({
  firstName: Yup.string().required("Ad zorunludur"),
  lastName: Yup.string().required("Soyad zorunludur"),
  email: Yup.string().email("Geçerli bir e-posta giriniz").nullable(),
});

const availabilitySchema = Yup.object({
  date: Yup.string().required("Tarih seçiniz"),
  type: Yup.number().required(),
  startTime: Yup.string().nullable(),
  endTime: Yup.string().nullable(),
  reason: Yup.string().nullable(),
});

const staffRoles = [
  { value: "", label: "Rol seçiniz" },
  { value: "Admin", label: "Yönetici" },
  { value: "Staff", label: "Personel" },
  { value: "Customer", label: "Müşteri" },
];

export function StaffManagementPage() {
  const {
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
  } = useStaffManagement();

  const [isCreating, setIsCreating] = useState(false);
  const scheduleInitialValues = useMemo(() => selectedSchedules, [selectedSchedules]);

  return (
    <div className="page staff-page">
      <header className="page-header">
        <h1>Personel Kontrol Merkezi</h1>
        <p>Ekip üyelerinizin profilleri, müsaitlikleri ve izin kayıtları bu panelden yönetilir. Her güncelleme anında randevu akışına yansır.</p>
      </header>
      <div className="staff-layout">
        <aside className="staff-list">
          <div className="list-header">
            <h2>Ekip Üyeleri</h2>
            <button type="button" className="primary" onClick={() => setIsCreating(true)}>
              Yeni Personel
            </button>
          </div>
          {isLoadingList ? (
            <div className="page-loading">Liste yükleniyor...</div>
          ) : (
            <ul>
              {staffMembers.map((staff) => (
                <li key={staff.id} className={staff.id === selectedStaffId ? "active" : ""}>
                  <button type="button" onClick={() => selectStaff(staff.id)}>
                    <span className="name">{staff.fullName || `${staff.firstName} ${staff.lastName}`}</span>
                    {staff.title ? <span className="meta">{staff.title}</span> : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
        <section className="staff-details">
          {isCreating ? (
            <NewStaffCard
              onCancel={() => setIsCreating(false)}
              onSubmit={async (payload) => {
                await createStaff(payload);
                setIsCreating(false);
              }}
              isSaving={isSaving}
            />
          ) : null}

          {selectedStaff ? (
            <StaffDetailCard
              staff={selectedStaff}
              isLoading={isLoadingDetail}
              isSaving={isSaving}
              schedules={scheduleInitialValues}
              onUpdate={updateStaff}
              onDelete={async (id) => {
                await deleteStaff(id);
                toast.info("Personel kaydı silindi ve liste güncellendi.");
              }}
              onScheduleSave={async (schedules) => {
                await updateSchedule(selectedStaff.id, { schedules });
              }}
              onCreateAvailability={async (payload) => {
                await createAvailabilityOverride(selectedStaff.id, payload);
              }}
              onDeleteAvailability={async (overrideId) => {
                await deleteAvailabilityOverride(selectedStaff.id, overrideId);
              }}
            />
          ) : (
            <div className="empty-state">Soldaki listeden bir personel seçin veya yeni bir profil oluşturun.</div>
          )}
        </section>
      </div>
    </div>
  );
}

type NewStaffCardProps = {
  onCancel: () => void;
  onSubmit: (payload: CreateStaffPayload) => Promise<void>;
  isSaving: boolean;
};

function NewStaffCard({ onCancel, onSubmit, isSaving }: NewStaffCardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Yeni Personel</h3>
      </div>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          title: "",
          email: "",
          phoneNumber: "",
          isActive: true,
          userId: "",
          hiredAtUtc: "",
        }}
        validationSchema={staffSchema}
        onSubmit={async (values, helpers) => {
          const payload: CreateStaffPayload = {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            title: values.title.trim() || null,
            email: values.email.trim() || null,
            phoneNumber: values.phoneNumber.trim() || null,
            isActive: values.isActive,
            userId: values.userId || null,
            hiredAtUtc: values.hiredAtUtc || null,
          };

          await onSubmit(payload);
          helpers.resetForm();
        }}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form className="form-grid">
            <label>
              <span>Ad</span>
              <input name="firstName" value={values.firstName} onChange={handleChange} />
              {touched.firstName && errors.firstName ? <small className="form-error">{errors.firstName}</small> : null}
            </label>
            <label>
              <span>Soyad</span>
              <input name="lastName" value={values.lastName} onChange={handleChange} />
              {touched.lastName && errors.lastName ? <small className="form-error">{errors.lastName}</small> : null}
            </label>
            <label>
              <span>Unvan</span>
              <input name="title" value={values.title} onChange={handleChange} />
            </label>
            <label>
              <span>E-posta</span>
              <input name="email" value={values.email} onChange={handleChange} />
              {touched.email && errors.email ? <small className="form-error">{errors.email}</small> : null}
            </label>
            <label>
              <span>Telefon</span>
              <input name="phoneNumber" value={values.phoneNumber} onChange={handleChange} />
            </label>
            <label>
              <span>Rol</span>
              <select name="userId" value={values.userId} onChange={handleChange}>
                {staffRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>İşe Başlama (UTC)</span>
              <input type="datetime-local" name="hiredAtUtc" value={values.hiredAtUtc} onChange={handleChange} />
            </label>
            <label className="inline">
              <input type="checkbox" name="isActive" checked={values.isActive} onChange={handleChange} /> Aktif
            </label>
            <div className="form-actions">
              <button type="submit" className="primary" disabled={isSaving}>
                {isSaving ? "Kaydediliyor..." : "Personeli Oluştur"}
              </button>
              <button type="button" className="secondary" onClick={onCancel} disabled={isSaving}>
                İptal
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

type StaffDetailCardProps = {
  staff: StaffDetail;
  schedules: StaffSchedule[];
  isLoading: boolean;
  isSaving: boolean;
  onUpdate: (id: string, payload: UpdateStaffPayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onScheduleSave: (schedules: StaffSchedule[]) => Promise<void>;
  onCreateAvailability: (payload: CreateAvailabilityOverridePayload) => Promise<void>;
  onDeleteAvailability: (overrideId: string) => Promise<void>;
};

function StaffDetailCard({
  staff,
  schedules,
  isLoading,
  isSaving,
  onUpdate,
  onDelete,
  onScheduleSave,
  onCreateAvailability,
  onDeleteAvailability,
}: StaffDetailCardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{staff.fullName}</h3>
        <button
          type="button"
          className="danger"
          disabled={isSaving}
          onClick={async () => {
            if (confirm("Bu personeli silmek istediğinize emin misiniz?")) {
              await onDelete(staff.id);
            }
          }}
        >
          Sil
        </button>
      </div>
      {isLoading ? (
        <div className="page-loading">Detaylar yükleniyor...</div>
      ) : (
        <div className="card-content">
          <Formik
            initialValues={{
              firstName: staff.firstName,
              lastName: staff.lastName,
              title: staff.title ?? "",
              email: staff.email ?? "",
              phoneNumber: staff.phoneNumber ?? "",
              isActive: staff.isActive,
              userId: staff.userId ?? "",
              hiredAtUtc: staff.hiredAtUtc ?? "",
              terminatedAtUtc: staff.terminatedAtUtc ?? "",
            }}
            validationSchema={staffSchema}
            enableReinitialize
            onSubmit={async (values) => {
              const payload: UpdateStaffPayload = {
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                title: values.title.trim() || null,
                email: values.email.trim() || null,
                phoneNumber: values.phoneNumber.trim() || null,
                isActive: values.isActive,
                userId: values.userId || null,
                hiredAtUtc: values.hiredAtUtc || null,
                terminatedAtUtc: values.terminatedAtUtc || null,
              };

              await onUpdate(staff.id, payload);
            }}
          >
            {({ values, handleChange, errors, touched }) => (
              <Form className="form-grid">
                <label>
                  <span>Ad</span>
                  <input name="firstName" value={values.firstName} onChange={handleChange} />
                  {touched.firstName && errors.firstName ? <small className="form-error">{errors.firstName}</small> : null}
                </label>
                <label>
                  <span>Soyad</span>
                  <input name="lastName" value={values.lastName} onChange={handleChange} />
                  {touched.lastName && errors.lastName ? <small className="form-error">{errors.lastName}</small> : null}
                </label>
                <label>
                  <span>Unvan</span>
                  <input name="title" value={values.title} onChange={handleChange} />
                </label>
                <label>
                  <span>E-posta</span>
                  <input name="email" value={values.email} onChange={handleChange} />
                  {touched.email && errors.email ? <small className="form-error">{errors.email}</small> : null}
                </label>
                <label>
                  <span>Telefon</span>
                  <input name="phoneNumber" value={values.phoneNumber} onChange={handleChange} />
                </label>
                <label>
                  <span>Rol</span>
                  <select name="userId" value={values.userId} onChange={handleChange}>
                    {staffRoles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>İşe Başlama (UTC)</span>
                  <input type="datetime-local" name="hiredAtUtc" value={values.hiredAtUtc ?? ""} onChange={handleChange} />
                </label>
                <label>
                  <span>Ayrılış (UTC)</span>
                  <input type="datetime-local" name="terminatedAtUtc" value={values.terminatedAtUtc ?? ""} onChange={handleChange} />
                </label>
                <label className="inline">
                  <input type="checkbox" name="isActive" checked={values.isActive} onChange={handleChange} /> Aktif
                </label>
                <div className="form-actions">
                  <button type="submit" className="primary" disabled={isSaving}>
                    {isSaving ? "Kaydediliyor..." : "Profil Bilgilerini Güncelle"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <ScheduleEditor schedules={schedules} onSave={onScheduleSave} isSaving={isSaving} />

          <AvailabilityManager
            overrides={staff.availabilityOverrides}
            onCreate={onCreateAvailability}
            onDelete={onDeleteAvailability}
            isSaving={isSaving}
          />
        </div>
      )}
    </div>
  );
}

type ScheduleEditorProps = {
  schedules: StaffSchedule[];
  onSave: (schedules: StaffSchedule[]) => Promise<void>;
  isSaving: boolean;
};

function ScheduleEditor({ schedules, onSave, isSaving }: ScheduleEditorProps) {
  const [local, setLocal] = useState<StaffSchedule[]>(schedules);
  const labels = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

  return (
    <div className="card-subsection">
      <h4>Çalışma Takvimi</h4>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Gün</th>
            <th>Çalışıyor</th>
            <th>Başlangıç</th>
            <th>Bitiş</th>
          </tr>
        </thead>
        <tbody>
          {local.map((item, index) => (
            <tr key={item.dayOfWeek}>
              <td>{labels[item.dayOfWeek]}</td>
              <td>
                <input
                  type="checkbox"
                  checked={item.isWorking}
                  onChange={(event) => {
                    const updated = [...local];
                    updated[index] = {
                      ...updated[index],
                      isWorking: event.currentTarget.checked,
                    };
                    if (!event.currentTarget.checked) {
                      updated[index].startTime = "";
                      updated[index].endTime = "";
                    }
                    setLocal(updated);
                  }}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={item.startTime ?? ""}
                  disabled={!item.isWorking}
                  onChange={(event) => {
                    const updated = [...local];
                    updated[index] = {
                      ...updated[index],
                      startTime: event.currentTarget.value,
                    };
                    setLocal(updated);
                  }}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={item.endTime ?? ""}
                  disabled={!item.isWorking}
                  onChange={(event) => {
                    const updated = [...local];
                    updated[index] = {
                      ...updated[index],
                      endTime: event.currentTarget.value,
                    };
                    setLocal(updated);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="form-actions">
        <button
          type="button"
          className="primary"
          disabled={isSaving}
          onClick={async () => {
            await onSave(local);
          }}
        >
          {isSaving ? "Kaydediliyor..." : "Takvimi Kaydet"}
        </button>
      </div>
    </div>
  );
}

type AvailabilityManagerProps = {
  overrides: StaffAvailabilityOverride[];
  onCreate: (payload: CreateAvailabilityOverridePayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isSaving: boolean;
};

function AvailabilityManager({ overrides, onCreate, onDelete, isSaving }: AvailabilityManagerProps) {
  return (
    <div className="card-subsection">
      <h4>İzin Kayıtları</h4>
      <Formik
        initialValues={{ date: "", type: 0, startTime: "", endTime: "", reason: "" }}
        validationSchema={availabilitySchema}
        onSubmit={async (values, helpers) => {
          const payload: CreateAvailabilityOverridePayload = {
            date: values.date,
            type: Number(values.type),
            startTime: values.startTime || null,
            endTime: values.endTime || null,
            reason: values.reason || null,
          };
          await onCreate(payload);
          helpers.resetForm();
        }}
      >
        {({ values, handleChange }) => (
          <Form className="availability-form">
            <label>
              <span>Tarih</span>
              <input type="date" name="date" value={values.date} onChange={handleChange} />
            </label>
            <label>
              <span>Tür</span>
              <select name="type" value={values.type} onChange={handleChange}>
                <option value={0}>İzin (Tam Gün)</option>
                <option value={1}>Ek Mesai / Uygunluk</option>
              </select>
            </label>
            <label>
              <span>Başlangıç</span>
              <input type="time" name="startTime" value={values.startTime} onChange={handleChange} />
            </label>
            <label>
              <span>Bitiş</span>
              <input type="time" name="endTime" value={values.endTime} onChange={handleChange} />
            </label>
            <label>
              <span>Açıklama</span>
              <input name="reason" value={values.reason} onChange={handleChange} />
            </label>
            <button type="submit" className="secondary" disabled={isSaving}>
              {isSaving ? "Kaydediliyor..." : "Ekle"}
            </button>
          </Form>
        )}
      </Formik>

      <ul className="availability-list">
        {overrides.map((item) => (
          <li key={item.id}>
            <div>
              <strong>{item.date}</strong> — {item.type === 0 ? "İzin" : "Uygunluk"}
              {item.startTime || item.endTime ? ` (${item.startTime ?? ""} - ${item.endTime ?? ""})` : null}
              {item.reason ? <span> • {item.reason}</span> : null}
            </div>
            <button
              type="button"
              className="link-button"
              disabled={isSaving}
              onClick={async () => {
                await onDelete(item.id);
              }}
            >
              Sil
            </button>
          </li>
        ))}
        {overrides.length === 0 ? <li>Henüz izin kaydı bulunmuyor.</li> : null}
      </ul>
    </div>
  );
}
