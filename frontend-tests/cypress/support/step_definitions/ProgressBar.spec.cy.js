import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const progressValue = () =>
  cy.get(".progress-bar").invoke("attr", "aria-valuenow").then(Number);

Given("access the DEMOQAwebsite", () => {
  cy.visit("https://demoqa.com/", { timeout: 120000, failOnStatusCode: false });
});

When("select the Widgets option on the home page", () => {
  cy.contains(".card-body h5", "Widgets").scrollIntoView().click();
});

When("click on the Progress Bar submenu", () => {
  cy.contains("span.text", "Progress Bar").click();
  cy.location("pathname").should("include", "/progress-bar");
});

When("click on the Start button", () => {
  cy.get("#startStopButton").scrollIntoView().click();
});

When("stop the progress bar before 25%", () => {
  const stopAtOrAfter = (target) => {
    return cy.get(".progress-bar").invoke("attr", "aria-valuenow").then((v) => {
      const val = Number(v);

      if (val >= target) {
        cy.get("#startStopButton").click();
        return;
      }

      cy.wait(100);
      return stopAtOrAfter(target);
    });
  };

  stopAtOrAfter(25);
});


Then("the progress value should be less than or equal to 25", () => {
  cy.get(".progress-bar")
    .invoke("attr", "aria-valuenow")
    .then((v) => {
      const val = Number(v);
      expect(val).to.be.at.least(25);
      expect(val).to.be.at.most(30);
    });
});


When("click on the Start button again", () => {
  cy.get("#startStopButton").scrollIntoView().click();
});

Then("the progress bar should reach 100%", () => {
  cy.get(".progress-bar", { timeout: 60000 }).should(
    "have.attr",
    "aria-valuenow",
    "100"
  );
});

Then("reset the progress bar", () => {
  cy.reload()
});
