import { expect } from 'chai';
import { app } from '../screenobjects/AppScreen.js';
import ExampleComponent from '../screenobjects/components/ExampleComponent.js';
import { EXAMPLE_TEST_DATA } from '../data/exampleTestData.js';
import { relaunchApp } from '../helpers/Utils.js';

/**
 * Example spec, copied to `tests/specs/app.<flow>.spec.ts`.
 * One `it` per requirement scenario; title starts with its scenario ID.
 * Keep inputs and expected result strings in tests/data/<flow>TestData.ts.
 */
describe('Example, when submitting the form,', () => {
    before(async () => {
        // All specs share one session, always start from a clean app state
        await relaunchApp();
    });

    beforeEach(async () => {
        await app.example.expectLoaded();
    });

    it('S1: should show a confirmation after submitting a valid name', async () => {
        await app.example.enterName(EXAMPLE_TEST_DATA.validName);
        await app.example.tapOnSubmitButton();

        expect(await app.example.getResultMessage()).to.contain(EXAMPLE_TEST_DATA.successMessage);
    });

    it('S2: should not allow submitting an empty name', async () => {
        expect(
            await app.example.isSubmitButtonEnabled(),
            'Submit must stay disabled until a name is entered',
        ).to.equal(false);
    });

    it('S3: should close the dialog when tapping OK', async () => {
        await app.example.tapOnSubmitButton();
        await ExampleComponent.waitForIsShown();
        await ExampleComponent.tapOnButtonWithText('OK');
        await ExampleComponent.waitForIsShown(false);
    });
});
