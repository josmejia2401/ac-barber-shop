import Observable from "./observable";

class Storage extends Observable {

    static PREFIX = "PSPC_";

    set(key, value) {
        window.localStorage.setItem(`${Storage.PREFIX}${key}`, value);
    }

    get(key) {
        return localStorage.getItem(`${Storage.PREFIX}${key}`);
    }

    remove(key) {
        return localStorage.removeItem(`${Storage.PREFIX}${key}`);
    }

    clear() {
        localStorage.clear();
        sessionStorage.clear();
    }
}

const storage = new Storage();
export default storage;