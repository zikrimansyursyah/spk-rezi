export function validateSchema(schema, data) {
  try {
    return schema.validateSync(data);
  } catch (error) {
    return { _error: true, message: error.message };
  }
}
