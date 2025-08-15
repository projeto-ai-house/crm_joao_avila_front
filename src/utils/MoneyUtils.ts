export class MoneyUtils {
  static formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  static parseCurrency(value: string): number {
    return Number(
      value.replace("R$", "").replace(".", "").replace(",", ".").trim()
    );
  }
}
