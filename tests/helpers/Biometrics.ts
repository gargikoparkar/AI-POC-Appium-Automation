import { $, getDriver } from '../../src/core/driver.js';
import { DEFAULT_PIN, INCORRECT_PIN } from './Constants.js';

class Biometrics {
    private get biometryAlert() {
        const regex = '(Please log in|Login with.*)';

        return $(`android=new UiSelector().textMatches("${regex}")`);
    }

    /**
     * Submit biometric login with a matching or non matching fingerprint
     */
    async submitBiometricLogin(successful: boolean) {
        await this.biometryAlert.waitForDisplayed({ timeout: 10 *1000 });

        await getDriver().fingerPrint(successful ? DEFAULT_PIN : INCORRECT_PIN);
    }
}

export default new Biometrics();
