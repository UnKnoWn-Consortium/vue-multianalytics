import 'regenerator-runtime/runtime';

/**
 * Plugin main class
 */
export default class AnalyticsPlugin {
    constructor(modulesEnabled) {
        this.modulesEnabled = modulesEnabled;
    }

    /**
     * Enable and initialize all analytics module
     * @param {object} config - additional config to augment the config passed when the class is instantiated
     */
    enable (config = {}) {
        this.modulesEnabled.forEach(
            module => {
                module.init(config);
            }
        );
    }

    /**
     * Disable all analytics module
     * @param {array} excludedModules
     */
    /*disable (excludedModules = []) {
        this.modulesEnabled.forEach(
            module => {
                if (excludedModules.indexOf(module.name) === -1) {
                    module.disable();
                }
            }
        );
    }*/

    /**
     * Dispatch a view analytics event
     *
     * params object should contain
     * @param {object} params
     * @param {array} excludedModules
     */
    trackView(params = {}, excludedModules = []) {
        if (!params.viewName) {
            return;
        }

        this.modulesEnabled.forEach(
            module => {
                if (excludedModules.indexOf(module.name) === -1) {
                    module.trackView(params);
                }
            }
        );
    }

    /**
     * Dispatch a tracking analytics event
     *
     * @param {object} params
     * @param {string} params.category
     * @param {string} params.action
     * @param {string} params.label
     * @param {any} params.value
     * @param {array} excludedModules
     */
    trackEvent(
        params = {},
        excludedModules = []
    ) {
        this.modulesEnabled.forEach(module => {
            if (excludedModules.indexOf(module.name) === -1) {
                module.trackEvent(params);
            }
        });
    }

    /**
     * Dispatch a tracking analytics event
     *
     * params object should contain
     * @param {object} params
     * @param {string} params.product
     * @param {string} params.productActionType
     * @param {object} params.attributes
     * @param {array} excludedModules
     */
    ecommerceTrackEvent(
        params = {},
        excludedModules = []
    ) {
        this.modulesEnabled.forEach(
            module => {
                if (excludedModules.indexOf(module.name) === -1) {
                    module.ecommerceTrackEvent(params);
                }
            }
        );
    }

    /**
     * Track an exception that occurred in the application.
     *
     * @param {object} params
     * @param {string} params.description - Something describing the error (max. 150 Bytes)
     * @param {boolean} params.isFatal - Specifies whether the exception was fatal
     * @param {array} excludedModules
     */
    trackException(
        params = {},
        excludedModules = []
    ) {
        this.modulesEnabled.forEach(
            module => {
                if (excludedModules.indexOf(module.name) === -1) {
                    module.trackException(params);
                }
            }
        );
    }

    /**
     * Track an user timing to measure periods of time.
     *
     * @param {object} params
     * @param {string} params.timingCategory - A string for categorizing all user timing variables into logical groups (e.g. 'JS Dependencies').
     * @param {string} params.timingVar -  A string to identify the variable being recorded (e.g. 'load').
     * @param {number} params.timingValue - The number of milliseconds in elapsed time to report to Google Analytics (e.g. 20).
     * @param {string|null} params.timingLabel -  A string that can be used to add flexibility in visualizing user timings in the reports (e.g. 'Google CDN').
     * @param {string[]} excludedModules
     */
    trackTiming(
        params = {},
        excludedModules = []
    ) {
        this.modulesEnabled.forEach(
            module => {
                if (excludedModules.indexOf(module.name) === -1) {
                    module.trackTiming(params);
                }
            }
        );
    }

    /**
     * Ecommerce transactions.
     * @param {long} id - Transaction ID. Required
     * @param {string} affiliation -  Affiliation or store name
     * @param {float} revenue - Grand Total
     * @param {flat} shipping -  Shipping
     * @param {float} tax - Tax
     * @param {string} currency - Currency - https://developers.google.com/analytics/devguides/platform/features/currencies
     */
    addTransaction(params = {}, excludedModules = []) {
        this.modulesEnabled.forEach(module => {
            if (excludedModules.indexOf(module.name) === -1) {
                module.addTransaction(params);
            }
        });
    }

    /**
     * Ecommerce transactions.
     * @param {long} id - Transaction ID. Required
     * @param {string} name -  Product name. Required.
     * @param {string} sku - SKU/code.
     * @param {string} category -  Category or variation.
     * @param {float} price - Unit price.
     * @param {int} quantity - Quantity
     * @param {string[]} excludedModules
     */
    addItem(params = {}, excludedModules = []) {
        this.modulesEnabled.forEach(module => {
            if (excludedModules.indexOf(module.name) === -1) {
                module.addItem(params);
            }
        });
    }

    /**
     * Ecommerce track a transaction.
     *
     */
    trackTransaction(excludedModules = []) {
        this.modulesEnabled.forEach(module => {
            if (excludedModules.indexOf(module.name) === -1) {
                module.trackTransaction();
            }
        });
    }

    /**
     * Ecommerce clear a transaction.
     * @param {string[]} excludedModules
     */
    clearTransactions(excludedModules = []) {
        this.modulesEnabled.forEach(module => {
            if (excludedModules.indexOf(module.name) === -1) {
                module.clearTransactions();
            }
        });
    }

    /**
     * Set the username.
     *
     * @param {string} name - The username
     * @param {string[]} excludedModules
     */
    setUsername(name, excludedModules = []) {
        this.modulesEnabled.forEach(module => {
            if (excludedModules.indexOf(module.name) === -1) {
                module.setUsername(name);
            }
        });
    }

    /**
     * Set some user properties.
     *
     * @param {any} properties - The user properties
     * @param {string[]} excludedModules
     */
    setUserProperties (properties = {}, excludedModules = []) {
        const modulesToExecute = this.modulesEnabled.filter(moduleToCheck => excludedModules.indexOf(moduleToCheck.name) === -1);
        return Promise.all(modulesToExecute.map(
            module => {
                return module.setUserProperties(properties)
            }
        ));
    }

    /**
     * Set some user properties once.
     *
     * @param {any} properties - The user properties once
     * @param {string[]} excludedModules
     */
    setUserPropertiesOnce(properties = {}, excludedModules = []) {
        const modulesToExecute = this.modulesEnabled.filter(moduleToCheck => excludedModules.indexOf(moduleToCheck.name) === -1);
        return Promise.all(modulesToExecute.map(
            module => {
                return module.setUserPropertiesOnce(
                    properties
                );
            }
        ));
    }

    /**
     * Set some user properties once.
     *
     * @param {any} properties - The some properties that will be sent in all the events if supported
     * @param {string[]} excludedModules
     */
    setSuperProperties(properties = {}, excludedModules = []) {
        this.modulesEnabled.forEach(module => {
            if (excludedModules.indexOf(module.name) === -1) {
                module.setSuperProperties(properties);
            }
        });
    }

    /**
     * Set some user properties.
     *
     * @param {any} properties - The some properties that will be sent in the next event
     * @param {string[]} excludedModules
     */
    setSuperPropertiesOnce(properties = {}, excludedModules = []) {
        this.modulesEnabled.forEach(module => {
            if (excludedModules.indexOf(module.name) === -1) {
                module.setSuperPropertiesOnce(properties);
            }
        });
    }

    /**
     * Identify the user
     *
     * @param {string} userId - The unique ID of the user
     * @param {object} options - Options to add
     * @param {string[]} excludedModules
     */
    identify(params = {}, excludedModules = []) {
        const modulesToExecute = this.modulesEnabled.filter(moduleToCheck => excludedModules.indexOf(moduleToCheck.name) === -1);
        return Promise.all(modulesToExecute.map(
            module => {
                return module.identify(params);
            }
        ));
    }

    /**
     * Set an alias for the current instance
     *
     * @param {string} alias - The alias to be set
     * @param {string[]} excludedModules
     */
    setAlias(alias, excludedModules = []) {
        this.modulesEnabled.forEach(module => {
            if (excludedModules.indexOf(module.name) === -1) {
                module.setAlias(alias);
            }
        });
    }

    /**
     * Resets the id & clears cache
     *
     * @param {string[]} excludedModules
     */
    reset(excludedModules = []) {
        const modulesToExecute = this.modulesEnabled.filter(moduleToCheck => excludedModules.indexOf(moduleToCheck.name) === -1);
        return Promise.all(modulesToExecute.map(
            module => {
                return module.reset();
            }
        ));
    }
}
