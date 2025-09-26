import { useState } from "react";
import type { FieldHookConfig } from "formik";
import { useField } from "formik";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  label: string;
  placeholder?: string;
}

export function PasswordInput({ label, placeholder, ...props }: PasswordInputProps & FieldHookConfig<string>) {
  const [field, meta] = useField<string>(props);
  const [visible, setVisible] = useState(false);
  const hasError = meta.touched && Boolean(meta.error);
  const toggleLabel = visible ? "Şifreyi gizle" : "Şifreyi göster";

  return (
    <label className={clsx("form-field", hasError && "has-error")}>
      <span className="form-label">{label}</span>
      <div className="password-field">
        <input
          className="form-input"
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete="current-password"
          {...field}
        />
        <button
          type="button"
          className="icon-button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={toggleLabel}
          title={toggleLabel}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={18} strokeWidth={1.75} aria-hidden /> : <Eye size={18} strokeWidth={1.75} aria-hidden />}
          <span className="sr-only">{toggleLabel}</span>
        </button>
      </div>
      {hasError ? <span className="form-error">{meta.error}</span> : null}
    </label>
  );
}
