export class DateUtils {
  // Recebe Date ou string, retorna string no formato ISO (yyyy-mm-dd)
  static formatDateBRtoISO(date: Date | string): string {
    if (!date) return "";
    let d: Date;
    if (typeof date === "string") {
      // Se vier como dd/mm/yyyy
      if (date.includes("/")) {
        const [day, month, year] = date.split("/");
        d = new Date(`${year}-${month}-${day}`);
      }
      // Se vier como ISO string (2025-06-02T00:00:00Z)
      else if (date.includes("T") || date.includes("Z")) {
        d = new Date(date);
      }
      // Se vier como yyyy-mm-dd
      else {
        d = new Date(date);
      }
    } else {
      d = date;
    }
    // Retorna apenas a data no formato yyyy-mm-dd
    return d.toISOString().split("T")[0];
  }

  // Recebe Date ou string, retorna string no formato ISO completo com timezone (yyyy-mm-ddTHH:mm:ss±HH:mm)
  static formatDateToISOWithTimezone(date: Date | string): string {
    if (!date) return "";
    let d: Date;
    if (typeof date === "string") {
      // Se vier como dd/mm/yyyy
      if (date.includes("/")) {
        const [day, month, year] = date.split("/");
        d = new Date(`${year}-${month}-${day}`);
      }
      // Se vier como ISO string (2025-06-02T00:00:00Z)
      else if (date.includes("T") || date.includes("Z")) {
        d = new Date(date);
      }
      // Se vier como yyyy-mm-dd
      else {
        d = new Date(date);
      }
    } else {
      d = date;
    }
    // Retorna a data no formato ISO completo com timezone local
    return d.toISOString().replace('Z', '-03:00');
  }
}
