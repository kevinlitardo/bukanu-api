export default function formatValidationErrors(errors) {
  const formatted: Record<string, string> = {};
  errors.forEach((err: any) => {
    const key = err.property;
    const messages = Object.values(err.constraints || {}).join(', ');
    formatted[key] = messages;
  });
  return formatted;
}
