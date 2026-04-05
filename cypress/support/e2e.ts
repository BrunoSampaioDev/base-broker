import "@cypress/code-coverage/support";

import "./commands";

// Configurações globais
beforeEach(() => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

afterEach(() => {
  cy.on("uncaught:exception", (err, _) => {
    if (err.message.includes("TradingView")) {
      return false;
    }
    return true;
  });
});
