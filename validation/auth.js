import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup.string().min(4, "username minimal 4 digit/karakter").required("masukan username/NIS anda"),
  password: yup.string().min(5, "password minimal 6 karakter").required("password harus diisi"),
  is_remember: yup.boolean().required("is_remember wajib dipilih"),
});
