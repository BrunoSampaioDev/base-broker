/* eslint-disable @typescript-eslint/no-namespace */
Cypress.Commands.add(
  "login",
  (email = "test@example.com", password = "123456") => {
    cy.visit("/");
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.contains("button", /login|entrar/i).click();
    cy.contains("Base Broker", { timeout: 10000 }).should("be.visible");
  },
);

Cypress.Commands.add(
  "createOrder",
  (side: string, ticker: string, quantity: string, price: string) => {
    cy.contains("button", side).click();
    cy.get('input[placeholder*="TAEE11"]', { timeout: 5000 }).type(ticker, {
      delay: 50,
    });
    cy.get('input[type="number"]').first().type(quantity);
    cy.get('input[type="number"]').last().type(price);
    cy.contains("button", /enviar|send/i).click();
  },
);

Cypress.Commands.add("openOrderDrawer", () => {
  cy.get("button[aria-label*='edit'], button svg", { timeout: 5000 })
    .first()
    .click();
  cy.contains("Histórico", { timeout: 5000 }).should("be.visible");
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      createOrder(
        side: string,
        ticker: string,
        quantity: string,
        price: string,
      ): Chainable<void>;
      openOrderDrawer(): Chainable<void>;
    }
  }
}

export {};
