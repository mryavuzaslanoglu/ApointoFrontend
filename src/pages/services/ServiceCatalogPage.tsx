import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import type { ServiceCategory, ServiceItem, UpdateServiceCategoryPayload, UpdateServicePayload } from "@/entities/service/model";
import type { StaffSummary } from "@/entities/staff/model";
import { useServiceCatalog } from "@/features/services/model";
import { staffApi } from "@/features/staff/api/staffApi";

const categorySchema = Yup.object({
  name: Yup.string().required("Kategori adı zorunludur"),
  displayOrder: Yup.number().min(0).required(),
});

const serviceSchema = Yup.object({
  name: Yup.string().required("Hizmet adı zorunludur"),
  price: Yup.number().min(0).required(),
  durationInMinutes: Yup.number().min(1).required(),
  bufferTimeInMinutes: Yup.number().min(0).required(),
  categoryId: Yup.string().required("Kategori seçiniz"),
});

export function ServiceCatalogPage() {
  const {
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
  } = useServiceCatalog();

  const [staffOptions, setStaffOptions] = useState<StaffSummary[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoadingStaff(true);
      try {
        const list = await staffApi.getStaffList();
        setStaffOptions(list);
      } catch (error) {
        toast.error("Personel listesi alınırken hata oluştu.");
      } finally {
        setIsLoadingStaff(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="page service-page">
      <header className="page-header">
        <h1>Hizmet Kataloğu</h1>
        <p>Menünüzü yönetin, fiyat/ süre ayarlarını düzenleyin ve ekibinizi hizmetlere atayın. Bu panelde yapılan değişiklikler randevu planlamasına anında yansır.</p>
      </header>

      {isLoading ? (
        <div className="page-loading">Veriler yükleniyor...</div>
      ) : (
        <div className="service-layout">
          <section className="card">
            <div className="card-header">
              <h3>Kategori Yönetimi</h3>
            </div>
            <Formik
              initialValues={{ name: "", description: "", displayOrder: 0, isActive: true }}
              validationSchema={categorySchema}
              onSubmit={async (values, helpers) => {
                await createCategory({
                  name: values.name.trim(),
                  description: values.description.trim() || null,
                  displayOrder: Number(values.displayOrder),
                  isActive: values.isActive,
                });
                helpers.resetForm();
              }}
            >
              {({ values, handleChange, errors, touched }) => (
                <Form className="form-grid">
                  <label>
                    <span>Kategori Adı</span>
                    <input name="name" value={values.name} onChange={handleChange} />
                    {touched.name && errors.name ? <small className="form-error">{errors.name}</small> : null}
                  </label>
                  <label>
                    <span>Açıklama</span>
                    <input name="description" value={values.description} onChange={handleChange} />
                  </label>
                  <div className="form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                    <label>
                      <span>Sıra</span>
                      <input type="number" name="displayOrder" value={values.displayOrder} onChange={handleChange} />
                    </label>
                    <label className="inline">
                      <input type="checkbox" name="isActive" checked={values.isActive} onChange={handleChange} /> Aktif
                    </label>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="secondary" disabled={isSaving}>
                      {isSaving ? "Kaydediliyor..." : "Kategori Ekle"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <ul className="category-list">
              {categories.map((category) => (
                <CategoryListItem
                  key={category.id}
                  category={category}
                  isSaving={isSaving}
                  onUpdate={updateCategory}
                  onDelete={async () => {
                    try {
                      await deleteCategory(category.id);
                    } catch {
                      /* hata mesajı hook içinde */
                    }
                  }}
                />
              ))}
              {categories.length === 0 ? <li>Henüz kategori oluşturulmadı.</li> : null}
            </ul>
          </section>

          <section className="card">
            <div className="card-header">
              <h3>Hizmet Yönetimi</h3>
            </div>
            <Formik
              initialValues={{
                name: "",
                description: "",
                price: 0,
                durationInMinutes: 30,
                bufferTimeInMinutes: 0,
                isActive: true,
                colorHex: "",
                categoryId: categories[0]?.id ?? "",
                staffIds: [] as string[],
              }}
              validationSchema={serviceSchema}
              enableReinitialize
              onSubmit={async (values, helpers) => {
                if (!values.categoryId) {
                  toast.error("Önce bir kategori seçmelisiniz.");
                  return;
                }

                await createService({
                  name: values.name.trim(),
                  description: values.description.trim() || null,
                  price: Number(values.price),
                  durationInMinutes: Number(values.durationInMinutes),
                  bufferTimeInMinutes: Number(values.bufferTimeInMinutes),
                  isActive: values.isActive,
                  colorHex: values.colorHex.trim() || null,
                  categoryId: values.categoryId,
                  staffIds: values.staffIds,
                });
                helpers.resetForm();
              }}
            >
              {({ values, handleChange, setFieldValue, errors, touched }) => (
                <Form className="form-grid">
                  <label>
                    <span>Hizmet Adı</span>
                    <input name="name" value={values.name} onChange={handleChange} />
                    {touched.name && errors.name ? <small className="form-error">{errors.name}</small> : null}
                  </label>
                  <label>
                    <span>Açıklama</span>
                    <input name="description" value={values.description} onChange={handleChange} />
                  </label>
                  <div className="form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                    <label>
                      <span>Fiyat</span>
                      <input type="number" name="price" value={values.price} onChange={handleChange} />
                    </label>
                    <label>
                      <span>Süre (dk)</span>
                      <input type="number" name="durationInMinutes" value={values.durationInMinutes} onChange={handleChange} />
                    </label>
                    <label>
                      <span>Tampon Süre (dk)</span>
                      <input type="number" name="bufferTimeInMinutes" value={values.bufferTimeInMinutes} onChange={handleChange} />
                    </label>
                    <label>
                      <span>Renk Kodu</span>
                      <input name="colorHex" value={values.colorHex} onChange={handleChange} placeholder="#7B5CFF" />
                    </label>
                  </div>
                  <label>
                    <span>Kategori</span>
                    <select name="categoryId" value={values.categoryId} onChange={handleChange}>
                      <option value="">Kategori seçiniz</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {touched.categoryId && errors.categoryId ? <small className="form-error">{errors.categoryId}</small> : null}
                  </label>
                  <label>
                    <span>Atanmış Personel</span>
                    <select
                      multiple
                      name="staffIds"
                      value={values.staffIds}
                      disabled={isLoadingStaff}
                      onChange={(event) => {
                        const options = Array.from(event.target.selectedOptions).map((option) => option.value);
                        setFieldValue("staffIds", options);
                      }}
                    >
                      {staffOptions.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.fullName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="inline">
                    <input type="checkbox" name="isActive" checked={values.isActive} onChange={handleChange} /> Aktif
                  </label>
                  <div className="form-actions">
                    <button type="submit" className="primary" disabled={isSaving}>
                      {isSaving ? "Kaydediliyor..." : "Hizmet Ekle"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="service-list">
              <ul>
                {services.map((service) => (
                  <li key={service.id} className={service.id === selectedServiceId ? "active" : ""}>
                    <button type="button" onClick={() => setSelectedServiceId(service.id)}>
                      <span className="name">{service.name}</span>
                      <span className="meta">{service.categoryName}</span>
                    </button>
                  </li>
                ))}
                {services.length === 0 ? <li>Henüz hizmet oluşturulmadı.</li> : null}
              </ul>

              {selectedService ? (
                <ServiceDetailCard
                  service={selectedService}
                  categories={categories}
                  staffOptions={staffOptions}
                  onUpdate={updateService}
                  onDelete={deleteService}
                  isSaving={isSaving}
                />
              ) : null}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

type CategoryListItemProps = {
  category: ServiceCategory;
  isSaving: boolean;
  onUpdate: (id: string, payload: UpdateServiceCategoryPayload) => Promise<void>;
  onDelete: () => Promise<void>;
};

function CategoryListItem({ category, isSaving, onUpdate, onDelete }: CategoryListItemProps) {
  return (
    <li className="category-item">
      <Formik
        initialValues={{
          name: category.name,
          description: category.description ?? "",
          displayOrder: category.displayOrder,
          isActive: category.isActive,
        }}
        validationSchema={categorySchema}
        enableReinitialize
        onSubmit={async (values) => {
          await onUpdate(category.id, {
            name: values.name.trim(),
            description: values.description.trim() || null,
            displayOrder: Number(values.displayOrder),
            isActive: values.isActive,
          });
        }}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form className="category-form">
            <input name="name" value={values.name} onChange={handleChange} />
            {touched.name && errors.name ? <small className="form-error">{errors.name}</small> : null}
            <input name="description" value={values.description} onChange={handleChange} placeholder="Açıklama" />
            <div className="inline-fields">
              <input type="number" name="displayOrder" value={values.displayOrder} onChange={handleChange} className="small" />
              <label className="inline">
                <input type="checkbox" name="isActive" checked={values.isActive} onChange={handleChange} /> Aktif
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="secondary" disabled={isSaving}>
                Güncelle
              </button>
              <button
                type="button"
                className="danger"
                disabled={isSaving}
                onClick={async () => {
                  if (confirm("Kategoriyi silmek istediğinize emin misiniz?")) {
                    await onDelete();
                  }
                }}
              >
                Sil
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </li>
  );
}

type ServiceDetailCardProps = {
  service: ServiceItem;
  categories: ServiceCategory[];
  staffOptions: StaffSummary[];
  onUpdate: (id: string, payload: UpdateServicePayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isSaving: boolean;
};

function ServiceDetailCard({ service, categories, staffOptions, onUpdate, onDelete, isSaving }: ServiceDetailCardProps) {
  return (
    <div className="service-detail">
      <h4>{service.name}</h4>
      <Formik
        initialValues={{
          name: service.name,
          description: service.description ?? "",
          price: service.price,
          durationInMinutes: service.durationInMinutes,
          bufferTimeInMinutes: service.bufferTimeInMinutes,
          isActive: service.isActive,
          colorHex: service.colorHex ?? "",
          categoryId: service.categoryId,
          staffIds: service.assignedStaff.map((staff) => staff.id),
        }}
        validationSchema={serviceSchema}
        enableReinitialize
        onSubmit={async (values) => {
          await onUpdate(service.id, {
            name: values.name.trim(),
            description: values.description.trim() || null,
            price: Number(values.price),
            durationInMinutes: Number(values.durationInMinutes),
            bufferTimeInMinutes: Number(values.bufferTimeInMinutes),
            isActive: values.isActive,
            colorHex: values.colorHex.trim() || null,
            categoryId: values.categoryId,
            staffIds: values.staffIds,
          });
        }}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form className="form-grid">
            <label>
              <span>Hizmet Adı</span>
              <input name="name" value={values.name} onChange={handleChange} />
            </label>
            <label>
              <span>Açıklama</span>
              <input name="description" value={values.description} onChange={handleChange} />
            </label>
            <div className="form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
              <label>
                <span>Fiyat</span>
                <input type="number" name="price" value={values.price} onChange={handleChange} />
              </label>
              <label>
                <span>Süre (dk)</span>
                <input type="number" name="durationInMinutes" value={values.durationInMinutes} onChange={handleChange} />
              </label>
              <label>
                <span>Tampon Süre (dk)</span>
                <input type="number" name="bufferTimeInMinutes" value={values.bufferTimeInMinutes} onChange={handleChange} />
              </label>
              <label>
                <span>Renk</span>
                <input name="colorHex" value={values.colorHex} onChange={handleChange} />
              </label>
            </div>
            <label>
              <span>Kategori</span>
              <select name="categoryId" value={values.categoryId} onChange={handleChange}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Atanmış Personel</span>
              <select
                multiple
                name="staffIds"
                value={values.staffIds}
                disabled={isLoadingStaff}
                onChange={(event) => {
                  const options = Array.from(event.target.selectedOptions).map((option) => option.value);
                  setFieldValue("staffIds", options);
                }}
              >
                {staffOptions.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.fullName}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline">
              <input type="checkbox" name="isActive" checked={values.isActive} onChange={handleChange} /> Aktif
            </label>
            <div className="form-actions">
              <button type="submit" className="primary" disabled={isSaving}>
                {isSaving ? "Kaydediliyor..." : "Güncelle"}
              </button>
              <button
                type="button"
                className="danger"
                disabled={isSaving}
                onClick={async () => {
                  if (confirm("Hizmeti silmek istediğinize emin misiniz?")) {
                    await onDelete(service.id);
                  }
                }}
              >
                Sil
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
