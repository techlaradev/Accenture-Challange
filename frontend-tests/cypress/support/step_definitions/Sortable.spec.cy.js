import { Given, When, Then, After } from "@badeball/cypress-cucumber-preprocessor";

const gridItemsText = () =>
  cy.get("#demo-tabpane-grid .list-group-item").then(($items) =>
    [...$items].map((el) => el.innerText.trim())
  );

const dragTextToPosition = (text, position1Based) => {
  cy.contains("#demo-tabpane-grid .list-group-item", text)
    .drag(`#demo-tabpane-grid .list-group-item:nth-child(${position1Based})`, {
      force: true,
    });

  cy.get("body").trigger("mouseup", { force: true });
};

Given("access the website DEMOQA", () => {
  cy.visit("https://demoqa.com/", {
    timeout: 120000,
    failOnStatusCode: false,
  });
});

When("select the Interactions option on the home page", () => {
  cy.contains(".card-body h5", "Interactions").scrollIntoView().click();
});

When("click on the Sortable submenu", () => {
  cy.contains("span.text", "Sortable").click();
  cy.location("pathname").should("include", "/sortable");
});

When("reorder items in ascending rule", () => {
  cy.get("#demo-tab-grid").click({ force: true });

  dragTextToPosition("One", 7);
  dragTextToPosition("Two", 6);
  dragTextToPosition("Three", 5);
  dragTextToPosition("Four", 4);
  dragTextToPosition("Five", 3);
  dragTextToPosition("Six", 2);
});

Then("the grid order should match the expected positions", () => {
  gridItemsText().then((after) => {
    expect(after.slice(0, 7)).to.deep.eq([
      "Seven",
      "Six",
      "Five",
      "Four",
      "Three",
      "Two",
      "One",
    ]);
  });
});

After(() => {
  cy.get("body").trigger("mouseup", { force: true });
});
