import { FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
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
            openTime: hour.isClosed ? null : hour.openTime ?? "",
            closeTime: hour.isClosed ? null : hour.closeTime ?? "",
          })),
        };

        await onSubmit(payload);
      }}
    >
      {({ values, handleChange, setFieldValue, errors, touched }) => (
        <Form className="form-grid">
          <section className="form-section">
            <header>
              <h2>Temel Bilgiler</h2>
              <p className="form-subtitle">İşletme kartviziti, arama listeleri ve rezervasyon sayfalarında buradaki veriler kullanılacaktır.</p>
            </header>
            <label>
              <span>İşletme Adı</span>
              <input name="name" value={values.name} onChange={handleChange} className="form-input" />
              {touched.name && errors.name ? <small className="form-error">{errors.name as string}</small> : null}
            </label>
            <label>
              <span>Açıklama</span>
              <textarea name="description" value={values.description} onChange={handleChange} rows={3} />
            </label>
            <div className="form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <label>
                <span>Telefon</span>
                <input name="phoneNumber" value={values.phoneNumber} onChange={handleChange} />
              </label>
              <label>
                <span>E-posta</span>
                <input name="email" value={values.email} onChange={handleChange} />
                {touched.email && errors.email ? <small className="form-error">{errors.email as string}</small> : null}
              </label>
              <label>
                <span>Web Sitesi</span>
                <input name="websiteUrl" value={values.websiteUrl} onChange={handleChange} />
                {touched.websiteUrl && errors.websiteUrl ? <small className="form-error">{errors.websiteUrl as string}</small> : null}
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
              <input name="address.line1" value={values.address.line1} onChange={handleChange} />
            </label>
            <label>
              <span>Adres Satırı 2</span>
              <input name="address.line2" value={values.address.line2} onChange={handleChange} />
            </label>
            <div className="form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              <label>
                <span>Şehir</span>
                <input name="address.city" value={values.address.city} onChange={handleChange} />
              </label>
              <label>
                <span>Eyalet / İl</span>
                <input name="address.state" value={values.address.state} onChange={handleChange} />
              </label>
              <label>
                <span>Posta Kodu</span>
                <input name="address.postalCode" value={values.address.postalCode} onChange={handleChange} />
              </label>
              <label>
                <span>Ülke</span>
                <input name="address.country" value={values.address.country} onChange={handleChange} />
              </label>
            </div>
          </section>

          <section className="form-section">
            <header>
              <h2>Çalışma Saatleri</h2>
              <p className="form-subtitle">Kapalı günleri işaretleyebilir, gerektiğinde açılış/kapanış saatlerini düzenleyebilirsiniz.</p>
            </header>
            <FieldArray name="operatingHours">
              {() => (
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Gün</th>
                      <th>Kapalı</th>
                      <th>Açılış</th>
                      <th>Kapanış</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.operatingHours.map((hour, index) => (
                      <tr key={hour.dayOfWeek}>
                        <td>{dayLabels[hour.dayOfWeek]}</td>
                        <td>
                          <input
                            type="checkbox"
                            name={`operatingHours.${index}.isClosed`}
                            checked={hour.isClosed}
                            onChange={(event) => {
                              const isClosed = event.currentTarget.checked;
                              setFieldValue(`operatingHours.${index}.isClosed`, isClosed);
                              if (isClosed) {
                                setFieldValue(`operatingHours.${index}.openTime`, "");
                                setFieldValue(`operatingHours.${index}.closeTime`, "");
                              }
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            name={`operatingHours.${index}.openTime`}
                            value={hour.openTime ?? ""}
                            onChange={handleChange}
                            disabled={hour.isClosed}
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            name={`operatingHours.${index}.closeTime`}
                            value={hour.closeTime ?? ""}
                            onChange={handleChange}
                            disabled={hour.isClosed}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </FieldArray>
          </section>

          <div className="form-actions">
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

function ensureCompleteWeek(hours: OperatingHour[]): OperatingHour[] {
  const defaults: OperatingHour[] = Array.from({ length: 7 }, (_, index) => ({
    dayOfWeek: index,
    isClosed: index === 0,
    openTime: index === 0 ? "" : "09:00",
    closeTime: index === 0 ? "" : "18:00",
  }));

  const map = new Map<number, OperatingHour>();
  defaults.forEach((hour) => map.set(hour.dayOfWeek, hour));
  hours.forEach((hour) => map.set(hour.dayOfWeek, hour));

  return Array.from(map.values()).sort((a, b) => a.dayOfWeek - b.dayOfWeek);
}
