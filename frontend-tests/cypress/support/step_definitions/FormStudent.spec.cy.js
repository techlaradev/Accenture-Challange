import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("navigate to the DEMOQA website", () => {
cy.visit("https://demoqa.com/", { timeout: 120000 });
});

When("click on 'Forms' in menu", () => {
  cy.contains(".card-body h5", "Forms").scrollIntoView().click();
});

When("click on pratice form on the sub-menu", () => {
  cy.contains("span.text", "Practice Form").click();
});

When("type a valid first name", () => {
  cy.get("#firstName").type("Lara");
});

When("type a valid last name", () => {
  cy.get("#lastName").type("Cardoso");
});

When("type a valid email", () => {
  cy.get("#userEmail").type("lara.cardoso@example.com");
});

When("click in 'female' checkbox", () => {
  cy.contains("label", "Female").click();
});

When("type valid phone number", () => {
  cy.get("#userNumber").type("11999999");
});

When("select a valid birth date", () => {
  cy.get("#dateOfBirthInput")
    .invoke("val", "22 Aug 1996")
    .trigger("change");
});


When("type 'English' as a valid subject", () => {
  cy.get("#subjectsInput")
    .scrollIntoView()
    .should("be.visible")
    .click({ force: true })
    .type("English{enter}", { force: true });
});

When("check 3 of 3 checkboxes: Sports,Reading or Music", () => {
cy.contains("label", "Sports").click();
  cy.contains("label", "Reading").click();
  cy.contains("label", "Music").click();
});

When('click in escolher arquivo and upload teste.txt', () => {
  cy.get("#uploadPicture")
    .scrollIntoView()
    .selectFile(`cypress/fixtures/teste.txt`, { force: true });
});


When("type a valid current address Rua dos Testers", () => {
  cy.get("#currentAddress").type("Rua dos Testers");
});

When("select a valid state NCR", () => {
  cy.get("#state").scrollIntoView().click({ force: true });
  cy.get("#react-select-3-input").type("NCR{enter}", { force: true });
});

When("select a valid city Delhi", () => {
  cy.get("#city").scrollIntoView().click({ force: true });
  cy.get("#react-select-4-input").type("Delhi{enter}", { force: true });
});


Then("click on submit button", () => {
  cy.get("#submit").scrollIntoView().click({ force: true });

  cy.get("#example-modal-sizes-title-lg")
    .should("be.visible")
    .and("have.text", "Thanks for submitting the form");
});
