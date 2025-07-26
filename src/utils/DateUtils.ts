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

    // Converte a data local para UTC considerando o timezone do cliente
    const utcDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return utcDate.toISOString();
  }

  static generateDateAndHour(date: Date | string, hour: string): string {
    if (!date || !hour) return "";

    let dateISO: string = "";
    if (date instanceof Date) {
      dateISO = date.toISOString().split("T")[0];
    } else if (typeof date === "string") {
      if (date.includes("/")) {
        const [day, month, year] = date.split("/");
        dateISO = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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

    return combinedDate.toString();
  }

  /**
   * Converte uma data UTC do banco para o horário local do cliente
   * @param utcDate Data em UTC (string ou Date)
   * @returns String ISO no horário local do cliente
   */
  static convertUTCToLocalTime(utcDate: Date | string): string {
    if (!utcDate) return "";

    let d: Date;
    if (typeof utcDate === "string") {
      // Se a string não termina com 'Z', assume que é UTC e adiciona
      if (
        !utcDate.endsWith("Z") &&
        !utcDate.includes("+") &&
        !utcDate.includes("-")
      ) {
        d = new Date(utcDate + "Z");
      } else {
        d = new Date(utcDate);
      }
    } else {
      d = utcDate;
    }

    // Converte UTC para horário local considerando o timezone do cliente
    const localDate = new Date(
      d.getTime() + new Date().getTimezoneOffset() * 60000
    );
    return localDate.toISOString();
  }

  /**
   * Separa uma data em array contendo data e hora formatadas
   * @param date Data (string ou Date)
   * @returns Array [data, hora] formatados
   */
  static separateDateAndTime(date: Date | string): [string, string] {
    if (!date) return ["", ""];

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

    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString();
    const dateFormatted = `${day}/${month}/${year}`;
    const timeFormatted = d.toTimeString().split(" ")[0].substring(0, 5); // HH:MM

    return [dateFormatted, timeFormatted];
  }
}
