type Vars = Record<string, string | number | undefined | null>;

export function renderApprovedTemplate(body: string, vars: Vars) {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = vars[key];
    if (value === undefined || value === null || value === "") {
      return "";
    }
    return String(value);
  });
}
