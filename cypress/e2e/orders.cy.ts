const TICKERS = ["PETR4", "VALE3", "ITUB4", "BBDC4", "TAEE11"];

/**
 * Page layout (page.tsx):
 *   form[0] → OrderForm side="BUY"
 *   form[1] → OrderForm side="SELL"
 *   form[2] → OrderFilters
 */
function fillOrderForm(
  side: "BUY" | "SELL",
  ticker: string,
  quantity: string,
  price: string,
) {
  const formIndex = side === "BUY" ? 0 : 1;
  cy.get("form", { timeout: 10000 })
    .eq(formIndex)
    .within(() => {
      cy.get('input[placeholder="Ex: TAEE11"]').clear().type(ticker);
      cy.get('input[placeholder="Ex: 1.234,56"]').clear().type(price);
      cy.get('input[placeholder="Ex: 20"]').clear().type(quantity);
      cy.get('button[type="submit"]').click();
    });
}

describe("Base Broker - Orders Flow", () => {
  beforeEach(() => {
    cy.visit("/", { failOnStatusCode: false, timeout: 30000 });
    cy.window({ timeout: 10000 }).should("exist");
    cy.wait(2000);
    cy.get("body", { timeout: 10000 }).should("exist");
  });

  describe("Create Order", () => {
    it("should create a BUY order successfully", () => {
      fillOrderForm("BUY", "PETR4", "100", "4300");

      cy.contains("Ordem criada com sucesso", { timeout: 10000 }).should(
        "be.visible",
      );
      cy.contains("Ordem de Compra para PETR4 criada com sucesso!", {
        timeout: 10000,
      }).should("be.visible");

      cy.get("tbody tr", { timeout: 10000 })
        .first()
        .within(() => {
          cy.contains("PETR4").should("exist");
          cy.contains("Compra").should("exist");
          cy.contains("Aberta").should("exist");
        });
    });

    it("should create a SELL order successfully", () => {
      fillOrderForm("SELL", "VALE3", "50", "99999999");

      cy.get("tbody tr", { timeout: 10000 })
        .first()
        .within(() => {
          cy.contains("VALE3").should("exist");
          cy.contains("Venda").should("exist");
          cy.contains("Aberta").should("exist");
        });
    });

    it("should show an error toast when order creation fails", () => {
      cy.intercept("POST", "http://localhost:3001/orders", {
        forceNetworkError: true,
      }).as("createOrderFailure");

      fillOrderForm("BUY", "PETR4", "100", "4300");

      cy.wait("@createOrderFailure");
      cy.contains("Erro ao criar ordem", { timeout: 10000 }).should(
        "be.visible",
      );
      cy.contains("Não foi possível criar a ordem de Compra para PETR4.", {
        timeout: 10000,
      }).should("be.visible");
    });

    it("should reject invalid ticker format", () => {
      cy.get("form", { timeout: 10000 })
        .eq(0)
        .within(() => {
          cy.get('input[placeholder="Ex: TAEE11"]').type("ABC44");
          cy.get('input[placeholder="Ex: 1.234,56"]').type("4300");
          cy.get('input[placeholder="Ex: 20"]').type("100");
          cy.get('button[type="submit"]').click();
        });

      cy.contains(/inválido|não encontrado|formato/i, { timeout: 5000 }).should(
        "be.visible",
      );
    });

    it("should reject unknown ticker", () => {
      cy.get("form", { timeout: 10000 })
        .eq(0)
        .within(() => {
          cy.get('input[placeholder="Ex: TAEE11"]').type("XPTO3");
          cy.get('input[placeholder="Ex: 1.234,56"]').type("4300");
          cy.get('input[placeholder="Ex: 20"]').type("100");
          cy.get('button[type="submit"]').click();
        });

      cy.contains(/não encontrado|inválido/i, { timeout: 5000 }).should(
        "be.visible",
      );
    });

    it("should validate required fields", () => {
      cy.get("form", { timeout: 10000 })
        .eq(0)
        .within(() => {
          cy.get('button[type="submit"]').click();
        });

      cy.contains(/obrigatório/i, { timeout: 5000 }).should("be.visible");
    });

    it("should accept all valid tickers", () => {
      TICKERS.forEach((ticker) => {
        fillOrderForm("BUY", ticker, "10", "4000");
        cy.get("tbody tr", { timeout: 10000 })
          .first()
          .contains(ticker)
          .should("exist");
      });
    });
  });

  describe("Order Match", () => {
    it("should execute matching BUY and SELL orders", () => {
      fillOrderForm("BUY", "PETR4", "100", "4500");
      cy.wait(500);
      fillOrderForm("SELL", "PETR4", "100", "4500");

      cy.get("tbody tr", { timeout: 15000 }).then(($rows) => {
        const statuses = $rows.toArray().map((r) => r.textContent ?? "");
        const hasMatch = statuses.some(
          (text) => text.includes("Executada") || text.includes("Parcial"),
        );
        cy.wrap(hasMatch).should("eq", true);
      });
    });

    it("should not match orders with different tickers", () => {
      fillOrderForm("BUY", "PETR4", "100", "4500");
      cy.wait(500);
      fillOrderForm("SELL", "VALE3", "100", "4500");

      cy.get("tbody tr", { timeout: 10000 })
        .first()
        .contains("Aberta")
        .should("exist");
    });

    it("should partially match when quantities differ", () => {
      fillOrderForm("BUY", "ITUB4", "200", "3500");
      cy.wait(500);
      fillOrderForm("SELL", "ITUB4", "50", "3500");

      cy.get("tbody tr", { timeout: 15000 }).then(($rows) => {
        const statuses = $rows.toArray().map((r) => r.textContent ?? "");
        const hasPartialOrExecuted = statuses.some(
          (text) => text.includes("Parcial") || text.includes("Executada"),
        );
        cy.wrap(hasPartialOrExecuted).should("eq", true);
      });
    });
  });

  describe("Cancel Order", () => {
    beforeEach(() => {
      fillOrderForm("BUY", "BBDC4", "100", "1");
      cy.get("tbody tr", { timeout: 10000 })
        .first()
        .contains("Aberta")
        .should("exist");
    });

    it("should cancel an order with valid signature", () => {
      cy.get("tbody tr", { timeout: 10000 })
        .first()
        .find("td")
        .first()
        .invoke("text")
        .as("orderShortId");

      cy.get("tbody tr", { timeout: 10000 })
        .first()
        .find("button")
        .click({ force: true });
      cy.contains("Histórico da Ordem", { timeout: 10000 }).should(
        "be.visible",
      );

      cy.contains("button", /cancelar ordem/i, { timeout: 5000 }).click({
        force: true,
      });
      cy.contains("Cancelamento de ordem", { timeout: 5000 }).should(
        "be.visible",
      );

      cy.get('[role="dialog"] input[type="password"]', { timeout: 5000 }).type(
        "minha-assinatura",
      );
      cy.get('[role="dialog"] button[type="submit"]', { timeout: 5000 }).click({
        force: true,
      });

      cy.contains("Ordem cancelada com sucesso", { timeout: 10000 }).should(
        "be.visible",
      );

      cy.get("@orderShortId").then((orderShortId) => {
        const id = String(orderShortId).trim();
        cy.contains("tbody tr", id, { timeout: 10000 }).within(() => {
          cy.contains("Cancelada").should("exist");
        });
      });
    });

    it("should show an error toast when cancellation fails", () => {
      cy.intercept("PATCH", "http://localhost:3001/orders/*/cancel", {
        forceNetworkError: true,
      }).as("cancelOrderFailure");

      cy.get("tbody tr", { timeout: 10000 })
        .first()
        .find("td")
        .first()
        .invoke("text")
        .as("orderShortId");

      cy.get("tbody tr", { timeout: 10000 })
        .first()
        .find("button")
        .click({ force: true });
      cy.contains("Histórico da Ordem", { timeout: 10000 }).should(
        "be.visible",
      );

      cy.contains("button", /cancelar ordem/i, { timeout: 5000 }).click({
        force: true,
      });
      cy.contains("Cancelamento de ordem", { timeout: 5000 }).should(
        "be.visible",
      );

      cy.get('[role="dialog"] input[type="password"]', { timeout: 5000 }).type(
        "minha-assinatura",
      );
      cy.get('[role="dialog"] button[type="submit"]', { timeout: 5000 }).click({
        force: true,
      });

      cy.wait("@cancelOrderFailure");
      cy.contains("Erro ao cancelar ordem", { timeout: 10000 }).should(
        "be.visible",
      );
      cy.get("@orderShortId").then((orderShortId) => {
        cy.contains(`ID: ${String(orderShortId).trim()}`, {
          timeout: 10000,
        }).should("be.visible");
      });
    });

    it("should block cancellation without signature", () => {
      cy.get("tbody tr", { timeout: 10000 })
        .first()
        .find("button")
        .click({ force: true });
      cy.contains("Histórico da Ordem", { timeout: 10000 }).should(
        "be.visible",
      );

      cy.contains("button", /cancelar ordem/i, { timeout: 5000 }).click({
        force: true,
      });
      cy.contains("Cancelamento de ordem", { timeout: 5000 }).should(
        "be.visible",
      );

      cy.get('[role="dialog"] button[type="submit"]', { timeout: 5000 }).click({
        force: true,
      });

      cy.contains(/assinatura eletrônica.*obrigatória/i, {
        timeout: 5000,
      }).should("be.visible");
    });

    it("should close cancellation modal without cancelling", () => {
      cy.get("tbody tr", { timeout: 10000 })
        .first()
        .find("button")
        .click({ force: true });
      cy.contains("Histórico da Ordem", { timeout: 10000 }).should(
        "be.visible",
      );

      cy.contains("button", /cancelar ordem/i, { timeout: 5000 }).click({
        force: true,
      });
      cy.contains("Cancelamento de ordem", { timeout: 5000 }).should(
        "be.visible",
      );

      cy.contains("button", /fechar/i, { timeout: 5000 }).click({
        force: true,
      });
      cy.contains("Cancelamento de ordem", { timeout: 5000 }).should(
        "not.be.visible",
      );

      cy.get("tbody tr", { timeout: 10000 })
        .first()
        .contains("Aberta")
        .should("exist");
    });
  });

  describe("Filter Orders", () => {
    function submitFilterForm() {
      cy.get("form", { timeout: 10000 })
        .eq(2)
        .within(() => {
          cy.get('button[type="submit"]').first().click({ force: true });
        });
    }

    function submitClearFiltersForm() {
      cy.get("form", { timeout: 10000 })
        .eq(2)
        .within(() => {
          cy.get('button[type="submit"]').eq(1).click({ force: true });
        });
    }

    beforeEach(() => {
      fillOrderForm("BUY", "TAEE11", "300", "3200");
      cy.get("tbody tr", { timeout: 10000 })
        .first()
        .contains("TAEE11")
        .should("exist");
    });

    it("should filter by ticker", () => {
      cy.get('input[placeholder="Ticker"]', { timeout: 5000 }).type("TAEE11");
      submitFilterForm();

      cy.get("tbody tr", { timeout: 10000 }).should(($rows) => {
        const hasRows = $rows.length > 0;
        const allRowsContainTicker = [...$rows].every((row) =>
          (row.textContent ?? "").toUpperCase().includes("TAEE11"),
        );

        if (!hasRows || !allRowsContainTicker) {
          throw new Error("Tabela ainda nao refletiu apenas ordens de TAEE11");
        }
      });
    });

    it("should filter by side BUY", () => {
      cy.get("[data-testid='side']")
        .find("button")
        .first()
        .click({ force: true });
      cy.get("[role='option']").contains("Compra").click({ force: true });

      submitFilterForm();

      cy.get("tbody tr", { timeout: 10000 }).each(($row) => {
        cy.wrap($row).contains("Compra").should("exist");
      });
    });

    it("should filter by status OPEN", () => {
      cy.get("[data-testid='status']")
        .find("button")
        .first()
        .click({ force: true });
      cy.get("[role='option']").contains("Aberta").click({ force: true });

      submitFilterForm();

      cy.get("tbody tr", { timeout: 10000 }).each(($row) => {
        cy.wrap($row).contains("Aberta").should("exist");
      });
    });

    it("should clear filters and show all orders", () => {
      cy.get('input[placeholder="Ticker"]', { timeout: 5000 }).type("TAEE11");
      submitFilterForm();
      cy.get("tbody tr", { timeout: 10000 }).should("have.length.lessThan", 10);

      submitClearFiltersForm();
      cy.get("tbody tr", { timeout: 10000 }).should(
        "have.length.greaterThan",
        0,
      );
    });
  });
});
