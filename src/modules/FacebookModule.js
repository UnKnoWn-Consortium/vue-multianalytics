import { MODULE_FACEBOOK } from '../analyticsTypes'
import BasicModule from './BasicModule'
import { logDebug } from '../utils'



export default class FacebookModule extends BasicModule {

    constructor (config = {}) {
        super(MODULE_FACEBOOK);
        this.config = config;
    }

    init (initConf = {}) {
        this.config = Object.assign({}, this.config, initConf); // Override instantiated config with newly supplied initConf

        (function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.setAttribute('defer','');
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');

        // Apply default configuration
        // initConf = { ...pluginConfig, ...initConf }
        const mandatoryParams = [ 'token' ];
        mandatoryParams.forEach(
            el => {
                if (!initConf[ el ]) {
                    throw new Error(`VueAnalytics : Please provide a "${el}" from the config.`);
                }
            }
        );

        fbq('init', this.config.token);
    }


    // Methods

    /**
     * Dispatch a view analytics event
     * https://developers.facebook.com/docs/ads-for-websites/pixel-events/v2.8
     *
     * params object should contain
     *
     */
    trackView ({}) {
        fbq('track', 'PageView')
    }

    /**
     * Dispatch a tracking analytics event
     * https://developers.facebook.com/docs/ads-for-websites/pixel-events/v2.8
     *
     * params object should contain
     * @param {string} fb_event - Name of the specific event, it will be ViewContent by default
     * @param {string} category - Typically the object that was interacted with (e.g. 'Video')
     * @param {string} action - The type of interaction (e.g. 'play')
     * @param {string} label - Useful for categorizing events (e.g. 'Fall Campaign')
     * @param {integer} value - A numeric value associated with the event (e.g. 42)
     * @param {array} ids - Array of ids which are affected in event
     * @param {string} type - What kind of contente we are reffered with this event
     * @param {string} currency - Currency the event will use
     */
    trackEvent ({ fb_event = 'ViewContent', category = "Event", action, label = null, value = null, callback = null, ids = [], type = null, currency = null }) {
        if (this.config.debug === true) {
            logDebug(...arguments);
        }

        if (value) {
            var parsed = parseInt(value, 10);
            value = isNaN(parsed) ? 0 : parsed;
        }

        const fieldsObject = {
            content_name: label,
            content_category: category,
            content_ids: ids,
            content_type: type,
            value: value,
            currency: currency
        };

        fbq('track', fb_event, fieldsObject);
    }
}
