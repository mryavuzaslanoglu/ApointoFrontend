import { BusinessSettingsForm } from "@/features/business/ui";
import { useBusinessSettings } from "@/features/business/model";

export function BusinessSettingsPage() {
  const { data, isLoading, isSaving, save } = useBusinessSettings();

  if (isLoading || !data) {
    return <div className="page-loading">İşletme ayarları yükleniyor...</div>;
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>İşletme Ayarları</h1>
        <p>Misyon, iletişim ve çalışma saatleri burada hayat buluyor. Bu sayfada yaptığınız düzenlemeler tüm modüller tarafından kullanılır.</p>
      </header>
      <BusinessSettingsForm initialValues={data} onSubmit={save} isSubmitting={isSaving} />
    </div>
  );
}
