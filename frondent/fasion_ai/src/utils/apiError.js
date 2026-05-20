export function getApiErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  if (!err?.response) {
    if (err?.code === "ECONNABORTED") {
      return "Request timed out. Check your connection and try again.";
    }
    return "Cannot reach the server. Start the Django API (backent folder: python manage.py runserver).";
  }

  const { data, status } = err.response;

  if (typeof data === "string" && data.trim()) {
    return data.length > 200 ? fallback : data.trim();
  }

  if (data?.detail != null) {
    const detail = data.detail;
    if (Array.isArray(detail)) return String(detail[0] ?? fallback);
    return String(detail);
  }

  if (Array.isArray(data?.non_field_errors) && data.non_field_errors[0]) {
    return String(data.non_field_errors[0]);
  }

  if (data && typeof data === "object") {
    const parts = Object.entries(data).flatMap(([field, value]) => {
      if (Array.isArray(value)) return value.map((v) => `${field}: ${v}`);
      if (value != null && value !== "") return [`${field}: ${value}`];
      return [];
    });
    if (parts.length) return parts.join(" ");
  }

  if (status === 401 || status === 403) {
    return "Invalid email or password.";
  }

  return fallback;
}
