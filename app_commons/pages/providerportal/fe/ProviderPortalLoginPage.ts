import Utils from "../../../utils/Utils";
import ENV from "../../../environments/env";


class ProviderPortalLoginPage extends Utils {
    url: string;
    loginWithSSObutton: string;
    loginWithAzure: string;
    inputEmail: string;
    inputPassword: string
    submitButton: string
    signinButton: string
    inputAZConnectEmail: string;
    inputAZConnectPassword: string;
    loginWithAZConnectButton: string;

    constructor(page: any) {
        super(page);
        this.page = page;
        this.url = String(ENV.PROVIDER_PORTAL_FE_URL);
        this.loginWithSSObutton = '//button[@data-testid="login"]';
        this.loginWithAzure = '//a//img[@alt="Azure Login"]';
        this.inputEmail = '//input[@type="email"]';
        this.inputPassword = '//input[@id="passwordInput"]';
        this.submitButton = '//input[@type="submit"]';
        this.signinButton = '//span[@id="submitButton"]';
        this.inputAZConnectEmail = '//input[@id="username"]';
        this.inputAZConnectPassword = '//input[@id="password"]';
        this.loginWithAZConnectButton = '//input[@id="login_button"]';
    }

    async goToProviderPortalUrl() {
        await this.navigateTo(this.url);
    }

    async loginWithCredential(username: string, password: string) {
        await this.clickOnLoginWithSSOButton();
        await this.clickOnLoginWithAzure();
        await this.enterUsername(username);
        await this.enterPassword(password);
    }

    async clickOnLoginWithSSOButton() {
        await this.waitForSelector(this.loginWithSSObutton)
        await this.clickOn(this.loginWithSSObutton);
    }

    async clickOnLoginWithAzure() {
        await this.waitForSelector(this.loginWithAzure)
        await this.clickOn(this.loginWithAzure);
    }

    async enterUsername(username: string) {
        await this.waitForSelector(this.inputEmail)
        await this.enterText(this.inputEmail, username);
        await this.clickOn(this.submitButton);
    }   

    async enterPassword(password: string) {
        await this.waitForSelector(this.inputPassword)
        await this.enterText(this.inputPassword, password);
        await this.clickOn(this.signinButton);
        await this.clickOn(this.submitButton);
    }

    async loginWithAZConnect(username: string, password: string) {
        await this.clickOn(this.loginWithSSObutton);
        await this.enterText(this.inputAZConnectEmail, username);
        await this.enterText(this.inputAZConnectPassword, password);
        await this.clickOn(this.loginWithAZConnectButton);
    }
}
export default ProviderPortalLoginPage;
