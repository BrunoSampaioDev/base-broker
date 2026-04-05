import { masks } from "./masks";
describe("masks", () => {
  describe("FormatBRL", () => {
    it.each([
      ["1", "R$ 0,01"],
      ["10", "R$ 0,10"],
      ["100", "R$ 1,00"],
      ["1000", "R$ 10,00"],
      ["10000", "R$ 100,00"],
    ])("should format BRL %s to masked format %s", (input, expected) => {
      expect(masks.formatBRL(input)).toEqual(expected);
    });
  });
});
