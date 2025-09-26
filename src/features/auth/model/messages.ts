export const authMessageCatalog = {
  toast: {
    loginSuccess: "Hoş geldiniz!",
    loginFailed: "Giriş yapılamadı.",
    registerSuccess: "Kayıt başarılı.",
    registerFailed: "Kayıt işlemi başarısız.",
    forgotPasswordSuccess: "Şifre sıfırlama talimatı e-postanıza gönderildi.",
    forgotPasswordFailed: "Şifre sıfırlama isteği başarısız.",
    resetPasswordSuccess: "Şifreniz güncellendi.",
    resetPasswordFailed: "Şifre güncellenemedi.",
  },
  errors: {
    unexpected: "Beklenmeyen bir hata oluştu.",
    loginFailed: "Giriş yapılamadı.",
    registerFailed: "Kayıt işlemi başarısız.",
    forgotPasswordFailed: "Şifre sıfırlama isteği başarısız.",
    resetPasswordFailed: "Şifre güncellenemedi.",
    logout: "Çıkış esnasında hata oluştu",
  },
  validation: {
    emailInvalid: "Geçerli bir e-posta girin",
    emailRequired: "E-posta zorunlu",
    passwordRequired: "Şifre zorunlu",
    passwordMin: "En az 8 karakter olmalı",
    firstNameRequired: "Ad zorunlu",
    lastNameRequired: "Soyad zorunlu",
    confirmPasswordRequired: "Şifre tekrarı zorunlu",
    passwordsMismatch: "Şifreler eşleşmiyor",
  },
  forms: {
    login: {
      title: "Giriş Yap",
      submit: "Giriş Yap",
      links: {
        forgotPassword: "Şifremi Unuttum",
        register: "Hesabın yok mu? Kayıt ol",
      },
      fields: {
        email: {
          label: "E-posta",
          placeholder: "örnek@domain.com",
        },
        password: {
          label: "Şifre",
          placeholder: "********",
        },
      },
    },
    register: {
      title: "Kayıt Ol",
      submit: "Kayıt Ol",
      links: {
        login: "Zaten hesabın var mı? Giriş yap",
      },
      fields: {
        firstName: {
          label: "Ad",
          placeholder: "Adınız",
        },
        lastName: {
          label: "Soyad",
          placeholder: "Soyadınız",
        },
        email: {
          label: "E-posta",
          placeholder: "örnek@domain.com",
        },
        password: {
          label: "Şifre",
          placeholder: "********",
        },
        confirmPassword: {
          label: "Şifre Tekrarı",
          placeholder: "********",
        },
      },
    },
    forgotPassword: {
      title: "Şifremi Unuttum",
      subtitle: "E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.",
      submit: "Bağlantı Gönder",
      links: {
        backToLogin: "Giriş sayfasına dön",
      },
      fields: {
        email: {
          label: "E-posta",
          placeholder: "örnek@domain.com",
        },
      },
    },
    resetPassword: {
      title: "Şifreyi Sıfırla",
      submit: "Şifreyi Güncelle",
      links: {
        backToLogin: "Giriş sayfasına dön",
        requestNew: "Yeni bağlantı iste",
      },
      fields: {
        newPassword: {
          label: "Yeni Şifre",
          placeholder: "********",
        },
        confirmPassword: {
          label: "Şifre Tekrarı",
          placeholder: "********",
        },
      },
      invalidToken: {
        title: "Geçersiz bağlantı",
        description: "Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.",
      },
    },
  },
} as const;

export type AuthMessageCatalog = typeof authMessageCatalog;

export function useAuthMessages(): AuthMessageCatalog {
  return authMessageCatalog;
}
