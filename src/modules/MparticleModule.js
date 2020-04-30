import { MODULE_MPARTICLE } from "../analyticsTypes";
import BasicModule from "./BasicModule";
import { logDebug } from "../utils";

const OTHER = 8;
// https://github.com/mParticle/mparticle-sdk-javascript/blob/394a0663a02274fe7b148393f644f188a86f38a5/src/types.js#L88
const supportedIdentityTypes = [
    'other',
    'customerId',
    'facebook',
    'twitter',
    'google',
    'microsoft',
    'yahoo',
    'email',
    'facebookCustomAudienceId',
    'other2',
    'other3',
    'other4']

export default class MparticleModule extends BasicModule {
    constructor(config = {}) {
        super(MODULE_MPARTICLE);
        this.superProperties = {};
        this.config = config;
    }

    init(initConf = {}) {
        this.config = Object.assign({}, this.config, initConf); // Override instantiated config with newly supplied initConf

        // Apply default configuration
        // initConf = { ...pluginConfig, ...initConf }
        const mandatoryParams = ["token"];
        mandatoryParams.forEach(
            el => {
                if (!this.config[el]) {
                    throw new Error(
                        `VueMultianalytics : Please provide a "${el}" from the config.`
                    );
                }
            }
        );

        let config = { isDevelopmentMode: this.config.debug, ...this.config.config };

        window.mParticle = { config };

        // name of gloval variable changed from analytics to segment
        (function(apiKey) {
            window.mParticle = window.mParticle || {};
            window.mParticle.eCommerce = { Cart: {} };
            window.mParticle.Identity = {};
            window.mParticle.config = window.mParticle.config || {};
            window.mParticle.config.rq = [];
            window.mParticle.ready = function(f) {
                window.mParticle.config.rq.push(f);
            };

            function a(o, t) {
                return function() {
                    t && (o = t + "." + o);
                    var e = Array.prototype.slice.call(arguments);
                    e.unshift(o), window.mParticle.config.rq.push(e);
                };
            }
            var x = [
                    "endSession",
                    "logError",
                    "logEvent",
                    "logForm",
                    "logLink",
                    "logPageView",
                    "setSessionAttribute",
                    "setAppName",
                    "setAppVersion",
                    "setOptOut",
                    "setPosition",
                    "startNewSession",
                    "startTrackingLocation",
                    "stopTrackingLocation"
                ],
                y = ["setCurrencyCode", "logCheckout"],
                z = ["login", "logout", "modify"];
            x.forEach(function(o) {
                window.mParticle[o] = a(o);
            }),
                y.forEach(function(o) {
                    window.mParticle.eCommerce[o] = a(o, "eCommerce");
                }),
                z.forEach(function(o) {
                    window.mParticle.Identity[o] = a(o, "Identity");
                });

            const mp = document.createElement("script");

            mp.type = "text/javascript";
            mp.async = true;
            mp.src =
                `${ document.location.protocol === "https:" ? "https://jssdkcdns" : "http://jssdkcdn" }.mparticle.com/js/v2/${ apiKey }/mparticle.js`
            const s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(mp, s);
        })(this.config.token);
    }

    /**
     * https://segment.com/docs/sources/website/analytics.js/#page
     * Dispatch a page event
     *
     * params object should contain
     * @param {string} viewName
     */
    trackView({ viewName, properties = {}, customFlags = {} }) {
        if (!mParticle.logPageView) return;
        try {
            let fullProperties = Object.assign(properties, this.superProperties);
            mParticle.logPageView(viewName, fullProperties, customFlags);
        } catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    }
    /**
     * Dispatch a tracking analytics event
     * https://segment.com/docs/sources/website/analytics.js/#track
     *
     * params object should contain
     * @param {string} category - Typically the object that was interacted with (e.g. 'Video')
     * @param {string} action - The type of interaction (e.g. 'play')
     * @param {integer} eventType - Type of event for mParticle
     * @param {string} label - Useful for categorizing events (e.g. 'Fall Campaign')
     * @param {integer} value - A numeric value associated with the event (e.g. 42)
     */
    trackEvent(
        {
            category = "Event",
            action,
            eventType = OTHER,
            label = null,
            value = null,
            properties = {},
            callback = null
        }
    ) {
        if (!mParticle.logEvent) return;
        try {
            if (this.config.debug) {
                logDebug(...arguments);
            }
            let fullProperties = Object.assign(properties, this.superProperties);
            mParticle.logEvent(action, eventType, fullProperties);
        } catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    }

    /**
     * Dispatch a tracking analytics event
     * https://segment.com/docs/sources/website/analytics.js/#track
     *
     * params object should contain
     * @param {integer} productActionType - Type of action to ecommerce platform (e.g. 1)
     * @param {object} product - Product to be tracked
     * @param {object} attributes - object of attributes related to the event
     */
    ecommerceTrackEvent(
        {
            productActionType = mParticle.CommerceEventType.ProductAddToCart,
            product = [],
            properties = {},
            currency = undefined
        }
    ) {
        if (!mParticle.eCommerce || !mParticle.eCommerce.createProduct) return;
        try {
            if (this.config.debug) {
                logDebug(...arguments);
            }
            let mProduct = {};
            if (!Array.isArray(product)) {
                mProduct = mParticle.eCommerce.createProduct(
                    product.name,
                    product.sku || performance.now(),
                    product.price,
                    product.quantity
                );
            }

            let fullProperties = Object.assign(properties, this.superProperties);
            if (currency) {
                mParticle.eCommerce.setCurrencyCode(currency);
            }
            mParticle.eCommerce.logProductAction(
                productActionType,
                mProduct,
                fullProperties
            );
        } catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    }

    /**
     * associate your users and their actions to a recognizable userId
     * https://segment.com/docs/sources/website/analytics.js/#identify
     *
     * @param {any} properties - traits of your user. If you specify a properties.userId, then a userId will be set
     */

    identify(userParams) {
        return new Promise((resolve, reject) => {
            let strippedParams = { ...userParams }
            let notSupportedKeys = Object.keys(strippedParams).findAll(key => !supportedIdentityTypes.includes(key))
            notSupportedKeys.forEach(key => {
                delete strippedParams[key]
            })

            let identityRequest = { userIdentities: strippedParams };
            mParticle.Identity.login(identityRequest, result => {
                if (result.httpCode === 200) resolve(result);
                else reject(result);
            });
        });
    }

    reset() {
        return new Promise((resolve, reject) => {
            mParticle.Identity.logout({}, function(result) {
                if (result.httpCode === 200) {
                    resolve(result);
                } else reject(result);
            });
        });
    }

    setUserProperties(userParams) {
        let currentUser = mParticle.Identity.getCurrentUser();
        if (!currentUser) {
            return null;
        }
        for (let key in userParams) {
            currentUser.setUserAttribute(key, userParams[key]);
        }
    }

    /**
     * Define a property that will be sent across all the events
     *
     * @param {any} properties
     */
    setSuperProperties(properties = {}) {
        if (properties.isAuthorized !== undefined) {
            properties.isAuthorized = properties.isAuthorized ? "true" : "false";
        }
        this.superProperties = properties;
    }
}
