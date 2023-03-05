import * as yup from "yup";

export const getAllSiswaSchema = yup.object().shape({
  first: yup.number().required(),
  rows: yup.number().required(),
  search: yup.string().optional(),
});
