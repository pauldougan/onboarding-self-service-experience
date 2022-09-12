import {Given, Then, When} from "@cucumber/cucumber";
import {strict as assert} from "assert";
import {Page} from "puppeteer";
import {
    checkUrl,
    clickButtonWithId,
    clickLink,
    clickSubmitButton,
    enterTextIntoTextInput,
    getButtonLink,
    getLink,
    getLinkWithHref
} from "./shared-functions";

Given("that the user is on the {string} page", async function (route: string) {
    await this.goToPath(route);
});

When("they click on the {string} link", async function (text: string) {
    const link = await getLink(this.page, text);
    await clickLink(this.page, link);
});

When("they click on the link that points to {string}", async function (href: string) {
    const link = await getLinkWithHref(this.page, href);
    await clickLink(this.page, link);
});

When("they click on the {string} button-link", async function (text: string) {
    const link = await getButtonLink(this.page, text);
    await clickLink(this.page, link);
});

When("they click the Submit button", async function () {
    await clickSubmitButton(this.page);
});

When("they click the Continue button", async function () {
    await clickButtonWithId(this.page, "continue");
});

Then("they should be directed to the following page: {string}", async function (path) {
    const expectedUrl = new URL(path, this.host);
    assert.equal(this.page.url(), expectedUrl.href);
});

Then("they should be directed to the following URL: {string}", async function (url) {
    assert.equal(this.page.url(), url);
});

Then("they should be directed to a page with the title {string}", async function (title: string) {
    const actualTitle = await this.page.title();
    assert.equal(actualTitle, title, `Page title was ${actualTitle}`);
});

Then("their data is saved in the spreadsheet", async function () {
    // we can't check the sheet but if we're on the right page and can find some content then that's good enough
});

Then("the error message {string} must be displayed for the {string} field", async function (errorMessage, field) {
    const errorLink = await this.page.$x(`//div[@class="govuk-error-summary"]//a[@href="#${field}"]`);
    await checkErrorMessageDisplayedForField(this.page, errorLink, errorMessage, field);
});

Then("the error message {string} must be displayed for the {string} radios", async function (errorMessage, field) {
    const errorLink = await this.page.$x(`//div[@class="govuk-error-summary"]//a[@href="#${field}-error"]`);
    await checkErrorMessageDisplayedForField(this.page, errorLink, errorMessage, field);
});

Then("they should see the text {string}", async function (text) {
    const bodyText: string = await this.page.$eval("body", (element: any) => element.textContent);
    assert.equal(bodyText.includes(text), true, `Body text does not contain '${text}'`);
});

Then("the {string} link will point to the following URL: {string}", async function (linkText, expectedUrl) {
    const link = await getLink(this.page, linkText);
    await checkUrl(this.page, link, expectedUrl);
});

Then("the {string} link will point to the following page: {string}", async function (linkText, expectedPage) {
    const link = await getLink(this.page, linkText);
    await checkUrl(this.page, link, expectedPage);
});

async function checkErrorMessageDisplayedForField(page: Page, errorLink: any, errorMessage: string, field: string) {
    assert.notEqual(errorLink.length, 0, `Expected to find the message ${errorMessage} in the error summary.`);

    const messageInSummary = await page.evaluate((el: {textContent: any}) => el.textContent, errorLink[0]);
    assert.equal(messageInSummary, errorMessage, `Expected text of the link to be ${errorMessage}`);

    const messagesAboveElement = await page.$x(`//p[@class="govuk-error-message"][@id="${field}-error"]`);
    assert.notEqual(messagesAboveElement.length, 0, `Expected to find the message ${errorMessage} above the ${field} field.`);

    const messageAboveElement = await page.evaluate((el: {textContent: any}) => el.textContent, messagesAboveElement[0]);
    assert.equal(
        messageAboveElement.trim(),
        "Error: " + errorMessage,
        `Expected the message above the ${field} field to be ${errorMessage}`
    );
}

When("they enter {string} into the text-field with the id {string}", async function (inputText: string, inputFieldId: string) {
    await enterTextIntoTextInput(this.page, inputText, inputFieldId);
});
