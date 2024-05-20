import { test as fixture } from '@playwright/test'
import CommonPage from '../pages/common/common.page'


import Utils from '../utils/Utils'
import ProviderPortalLoginPage from '../pages/providerportal/fe/ProviderPortalLoginPage'
import ProviderSettingPage from '../pages/providerportal/fe/ProviderSettingPage'	
import NewServiceOrdersPage from '../pages/providerportal/fe/NewServiceOrdersPage'	
import ServiceOrderDetailsPage from '../pages/providerportal/fe/ServiceOrderDetailsPage'	

type TestFixtures = {
    utils: Utils
    providerPortalLoginPage: ProviderPortalLoginPage
	providerSettingPage: ProviderSettingPage
	newServiceOrdersPage: NewServiceOrdersPage
	serviceOrderDetailsPage: ServiceOrderDetailsPage
}

export const test = fixture.extend<TestFixtures>({

	utils: async ({ page }, use) => {
		await use(new Utils(page))
	},

	providerPortalLoginPage: async ({ page }, use) => {
		await use(new ProviderPortalLoginPage(page))
	},

	providerSettingPage: async ({ page }, use) => {
		await use(new ProviderSettingPage(page))
	},

	newServiceOrdersPage: async ({ page }, use) => {
		await use(new NewServiceOrdersPage(page))
	},

	serviceOrderDetailsPage: async ({ page }, use) => {
		await use(new ServiceOrderDetailsPage(page))
	}
})
export default test