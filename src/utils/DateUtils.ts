export class DateUtils {
  static formatDateBRtoISO(date: Date | string): string {
    if (!date) return "";
    let d: Date;
    if (typeof date === "string") {
      if (date.includes("/")) {
        const [day, month, year] = date.split("/");
        d = new Date(`${year}-${month}-${day}`);
      } else if (date.includes("T") || date.includes("Z")) {
        d = new Date(date);
      } else {
        d = new Date(date);
      }
    } else {
      d = date;
    }
    return d.toISOString().split("T")[0];
  }

  static formatDateToISOWithTimezone(date: Date | string): string {
    if (!date) return "";
    let d: Date;
    if (typeof date === "string") {
      if (date.includes("/")) {
        const [day, month, year] = date.split("/");
        d = new Date(`${year}-${month}-${day}`);
      } else if (date.includes("T") || date.includes("Z")) {
        d = new Date(date);
      } else {
        d = new Date(date);
      }
    } else {
      d = date;
    }
    return d.toISOString().replace("Z", "-03:00");
  }

  static formatDatetoISOGlobalTimezone(date: Date | string): string {
    if (!date) return "";
    let d: Date;
    if (typeof date === "string") {
      if (date.includes("/")) {
        const [day, month, year] = date.split("/");
        d = new Date(`${year}-${month}-${day}`);
      } else if (date.includes("T") || date.includes("Z")) {
        d = new Date(date);
      } else {
        d = new Date(date);
      }
    } else {
      d = date;
    }

    return d.toISOString();
  }

  static generateDateAndHour(date: Date | string, hour: string): string {
    if (!date || !hour) return "";
    
    let dateISO: string = "";
    if (date instanceof Date) {
      dateISO = date.toISOString().split("T")[0];
    } else if (typeof date === "string") {
      if (date.includes("/")) {
        const [day, month, year] = date.split("/");
        dateISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      } else if (date.includes("T") || date.includes("Z")) {
        dateISO = new Date(date).toISOString().split("T")[0];
      } else {
        dateISO = date;
      }
    }

    const dateAndHour = `${dateISO}T${hour}:00`;
    console.log("Date and Hour:", dateAndHour);
    
    const combinedDate = new Date(dateAndHour);
    if (isNaN(combinedDate.getTime())) {
      throw new Error(`Invalid date/time combination: ${dateAndHour}`);
    }
    
    return combinedDate.toISOString();
  }
}
