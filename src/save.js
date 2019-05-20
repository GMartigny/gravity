const storage = window.localStorage;

const encode = string => btoa(string);

const decode = string => atob(string);

/**
 * Storage manager
 */
export default class StorageManager {
    /**
     * Store a value
     * @param {String} key  - Identifier of the value
     * @param {*} value  - Any value
     */
    static store (key, value) {
        storage.setItem(key, encode(JSON.stringify(value)));
    }

    /**
     * Return a stored value
     * @param {String} key - Identifier of the value
     * @returns {*}
     */
    static get (key) {
        const value = storage.getItem(key);
        return value ? JSON.parse(decode(value)) : null;
    }
}
