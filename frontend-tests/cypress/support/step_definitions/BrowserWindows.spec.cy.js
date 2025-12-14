import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let newWindowUrl;

Given("access the DEMOQA website", () => {
  cy.visit("https://demoqa.com/", {
    timeout: 120000,
    failOnStatusCode: false,
  });
});

When("select the Alerts, Frame & Windows option on the home page", () => {
  cy.contains(".card-body h5", "Alerts, Frame & Windows")
    .scrollIntoView()
    .click();
});

When("click on the Browser Windows submenu", () => {
  cy.contains("span.text", "Browser Windows").click();
  cy.location("pathname", { timeout: 20000 }).should("include", "/browser-windows");
});

When("click on the New Window button", () => {
  cy.window().then((win) => {
    cy.stub(win, "open").as("windowOpen");
  });

  cy.get("#windowButton").scrollIntoView().click();

  cy.get("@windowOpen").should("have.been.called");
});

Then('verify that a new window is opened with the message "This is a sample page"', () => {
  cy.visit("https://demoqa.com/sample", { failOnStatusCode: false });
  cy.contains("This is a sample page").should("be.visible");
});

Then("close the newly opened window", () => {
  cy.go("back");
  cy.location("pathname").should("include", "/browser-windows");
});
