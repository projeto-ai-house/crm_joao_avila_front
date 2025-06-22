export class DateUtils {
  // Recebe Date ou string, retorna string no formato ISO (yyyy-mm-dd)
  static formatDateBRtoISO(date: Date | string): string {
    if (!date) return "";
    let d: Date;
    if (typeof date === "string") {
      // Se vier como dd/mm/yyyy
      const [day, month, year] = date.split("/");
      d = new Date(`${year}-${month}-${day}`);
    } else {
      d = date;
    }
    // Retorna apenas a data no formato yyyy-mm-dd
    return d.toISOString().split("T")[0];
  }
}
