import { FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { Clock4 } from "lucide-react";
import type { BusinessSettings, OperatingHour, UpdateBusinessSettingsPayload } from "@/entities/business/model";

const dayLabels: Record<number, string> = {
  0: "Pazar",
  1: "Pazartesi",
  2: "Salı",
  3: "Çarşamba",
  4: "Perşembe",
  5: "Cuma",
  6: "Cumartesi",
};

const DEFAULT_OPEN_TIME = "09:00";
const DEFAULT_CLOSE_TIME = "18:00";
const TIME_OPTIONS = createTimeOptions(30);

const schema = Yup.object({
  name: Yup.string().required("İşletme adı zorunludur"),
  email: Yup.string().email("Geçerli bir e-posta giriniz").nullable(),
  websiteUrl: Yup.string().url("Geçerli bir web adresi giriniz").nullable(),
  operatingHours: Yup.array().of(
    Yup.object({
      dayOfWeek: Yup.number().min(0).max(6).required(),
      isClosed: Yup.boolean().required(),
      openTime: Yup.string().nullable(),
      closeTime: Yup.string().nullable(),
    })
  ),
});

type BusinessSettingsFormProps = {
  initialValues: BusinessSettings;
  isSubmitting: boolean;
  onSubmit: (values: UpdateBusinessSettingsPayload) => Promise<void>;
};

type TimeSelectProps = {
  label: string;
  name: string;
  value: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
};

export function BusinessSettingsForm({ initialValues, onSubmit, isSubmitting }: BusinessSettingsFormProps) {
  const normalizedHours: OperatingHour[] = ensureCompleteWeek(initialValues.operatingHours);

  return (
    <Formik
      initialValues={{
        name: initialValues.name,
        description: initialValues.description ?? "",
        phoneNumber: initialValues.phoneNumber ?? "",
        email: initialValues.email ?? "",
        websiteUrl: initialValues.websiteUrl ?? "",
        address: {
          line1: initialValues.address?.line1 ?? "",
          line2: initialValues.address?.line2 ?? "",
          city: initialValues.address?.city ?? "",
          state: initialValues.address?.state ?? "",
          postalCode: initialValues.address?.postalCode ?? "",
          country: initialValues.address?.country ?? "",
        },
        operatingHours: normalizedHours,
      }}
      validationSchema={schema}
      onSubmit={async (values) => {
        const payload: UpdateBusinessSettingsPayload = {
          name: values.name.trim(),
          description: values.description.trim() || null,
          phoneNumber: values.phoneNumber.trim() || null,
          email: values.email.trim() || null,
          websiteUrl: values.websiteUrl.trim() || null,
          address: {
            line1: values.address.line1.trim() || null,
            line2: values.address.line2.trim() || null,
            city: values.address.city.trim() || null,
            state: values.address.state.trim() || null,
            postalCode: values.address.postalCode.trim() || null,
            country: values.address.country.trim() || null,
          },
          operatingHours: values.operatingHours.map((hour) => ({
            ...hour,
            openTime: hour.isClosed ? null : hour.openTime?.trim() || null,
            closeTime: hour.isClosed ? null : hour.closeTime?.trim() || null,
          })),
        };

        await onSubmit(payload);
      }}
    >
      {({ values, handleChange, setFieldValue, errors, touched }) => (
        <Form className="business-settings-form">
          <div className="business-settings-columns">
            <div className="business-settings-primary">
              <section className="form-section">
                <header>
                  <h2>Temel Bilgiler</h2>
                  <p className="form-subtitle">
                    İşletme kartviziti, arama listeleri ve rezervasyon sayfalarında buradaki veriler kullanılır.
                  </p>
                </header>
                <label>
                  <span>İşletme Adı</span>
                  <input name="name" value={values.name} onChange={handleChange} className="form-input" />
                  {touched.name && errors.name ? <small className="form-error">{errors.name as string}</small> : null}
                </label>
                <label>
                  <span>Açıklama</span>
                  <textarea name="description" value={values.description} onChange={handleChange} rows={3} className="form-input" />
                </label>
                <div className="form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                  <label>
                    <span>Telefon</span>
                    <input name="phoneNumber" value={values.phoneNumber} onChange={handleChange} className="form-input" />
                  </label>
                  <label>
                    <span>E-posta</span>
                    <input name="email" value={values.email} onChange={handleChange} className="form-input" />
                    {touched.email && errors.email ? <small className="form-error">{errors.email as string}</small> : null}
                  </label>
                  <label>
                    <span>Web Sitesi</span>
                    <input name="websiteUrl" value={values.websiteUrl} onChange={handleChange} className="form-input" />
                    {touched.websiteUrl && errors.websiteUrl ? (
                      <small className="form-error">{errors.websiteUrl as string}</small>
                    ) : null}
                  </label>
                </div>
              </section>

              <section className="form-section">
                <header>
                  <h2>Adres</h2>
                  <p className="form-subtitle">Konum bilgileriniz müşteri bildirimlerinde ve navigasyon bağlantılarında kullanılır.</p>
                </header>
                <label>
                  <span>Adres Satırı 1</span>
                  <input name="address.line1" value={values.address.line1} onChange={handleChange} className="form-input" />
                </label>
                <label>
                  <span>Adres Satırı 2</span>
                  <input name="address.line2" value={values.address.line2} onChange={handleChange} className="form-input" />
                </label>
                <div className="form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                  <label>
                    <span>Şehir</span>
                    <input name="address.city" value={values.address.city} onChange={handleChange} className="form-input" />
                  </label>
                  <label>
                    <span>Eyalet / İl</span>
                    <input name="address.state" value={values.address.state} onChange={handleChange} className="form-input" />
                  </label>
                  <label>
                    <span>Posta Kodu</span>
                    <input name="address.postalCode" value={values.address.postalCode} onChange={handleChange} className="form-input" />
                  </label>
                  <label>
                    <span>Ülke</span>
                    <input name="address.country" value={values.address.country} onChange={handleChange} className="form-input" />
                  </label>
                </div>
              </section>
            </div>

            <section className="form-section business-hours-section">
              <header>
                <h2>Çalışma Saatleri</h2>
                <p className="form-subtitle">
                  Kapalı günleri işaretleyebilir, açılış ve kapanış saatlerini modern zaman seçicilerle anında düzenleyebilirsiniz.
                </p>
              </header>
              <FieldArray name="operatingHours">
                {() => (
                  <div className="schedule-panel">
                    <div className="schedule-grid">
                      {values.operatingHours.map((hour, index) => {
                        const fieldBase = `operatingHours.${index}`;
                        const isClosed = Boolean(hour.isClosed);

                        return (
                          <article key={hour.dayOfWeek} className={clsx("schedule-card", isClosed && "is-closed")}>
                            <div className="schedule-card-header">
                              <span className="schedule-card-day">{dayLabels[hour.dayOfWeek]}</span>
                              <button
                                type="button"
                                className={clsx("schedule-chip", isClosed ? "chip-closed" : "chip-open")}
                                onClick={() => {
                                  const next = !isClosed;
                                  setFieldValue(`${fieldBase}.isClosed`, next);
                                  if (next) {
                                    setFieldValue(`${fieldBase}.openTime`, "");
                                    setFieldValue(`${fieldBase}.closeTime`, "");
                                  } else {
                                    setFieldValue(`${fieldBase}.openTime`, hour.openTime || DEFAULT_OPEN_TIME);
                                    setFieldValue(`${fieldBase}.closeTime`, hour.closeTime || DEFAULT_CLOSE_TIME);
                                  }
                                }}
                                aria-pressed={isClosed}
                              >
                                {isClosed ? "Kapalı" : "Açık"}
                              </button>
                            </div>

                            <div className="schedule-card-body">
                              <TimeSelect
                                label="Açılış"
                                name={`${fieldBase}.openTime`}
                                value={hour.openTime ?? ""}
                                disabled={isClosed}
                                onValueChange={(time) => {
                                  setFieldValue(`${fieldBase}.openTime`, time);
                                }}
                              />
                              <TimeSelect
                                label="Kapanış"
                                name={`${fieldBase}.closeTime`}
                                value={hour.closeTime ?? ""}
                                disabled={isClosed}
                                onValueChange={(time) => {
                                  setFieldValue(`${fieldBase}.closeTime`, time);
                                }}
                              />
                            </div>
                          </article>
                        );
                      })}
                    </div>
                    <p className="schedule-hint muted">
                      Saat listesi yarım saatlik dilimlerle öneriler sunar. Farklı bir saat gerekiyorsa aç/kapa düğmesine basıp listeden seçim yapabilirsiniz.
                    </p>
                  </div>
                )}
              </FieldArray>
            </section>
          </div>

          <div className="form-actions business-form-actions">
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

function TimeSelect({ label, name, value, disabled, onValueChange }: TimeSelectProps) {
  return (
    <label className="time-select">
      <span className="time-select-label">{label}</span>
      <div className={clsx("time-select-field", disabled && "is-disabled")}>
        <select
          className="form-input"
          name={name}
          value={value}
          onChange={(event) => onValueChange(event.currentTarget.value)}
          disabled={disabled}
        >
          <option value="">--:--</option>
          {TIME_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Clock4 className="time-select-icon" size={16} strokeWidth={1.5} aria-hidden="true" />
      </div>
    </label>
  );
}

function ensureCompleteWeek(hours: OperatingHour[]): OperatingHour[] {
  const defaults: OperatingHour[] = Array.from({ length: 7 }, (_, index) => ({
    dayOfWeek: index,
    isClosed: index === 0,
    openTime: index === 0 ? "" : DEFAULT_OPEN_TIME,
    closeTime: index === 0 ? "" : DEFAULT_CLOSE_TIME,
  }));

  const map = new Map<number, OperatingHour>();
  defaults.forEach((hour) => map.set(hour.dayOfWeek, hour));
  hours.forEach((hour) => map.set(hour.dayOfWeek, hour));

  return Array.from(map.values()).sort((a, b) => a.dayOfWeek - b.dayOfWeek);
}

function createTimeOptions(stepMinutes: number): string[] {
  const slots = Math.floor((24 * 60) / stepMinutes);
  return Array.from({ length: slots }, (_, index) => {
    const totalMinutes = index * stepMinutes;
    const hour = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minute = (totalMinutes % 60)
      .toString()
      .padStart(2, "0");
    return `${hour}:${minute}`;
  });
}
