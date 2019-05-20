/* global DEV */

import { BaseEvent, Scene } from "pencil.js";

// Screens
import titleBuilder from "./screens/title";
import levelSelectionBuilder from "./screens/level-selection";
import gameBuilder from "./screens/game";

let currentScreen = null;

const screenIds = {
    title: "title",
    levelSelection: "levelSelection",
    game: "game",
};

/**
 * @class
 */
class ScreenEvent extends BaseEvent {
    /**
     * ScreenEvent constructor
     * @param {String} eventName - Name of the event
     * @param {*} target - Screen initiating the event
     * @param {Scene} to - Target screen of the event #FIXME
     * @param {Object} [params] - Additional parameters send to new screen
     */
    constructor (eventName, target, to, params = {}) {
        super(eventName, target);
        this.to = to;
        this.params = params;
    }

    /**
     * @typedef {Object} ScreenEvents
     * @prop {String} change - Change of screen
     * @prop {String} show - Show a screen
     */
    /**
     * @returns {ScreenEvents}
     */
    static get events () {
        return {
            change: "screen-change",
            show: "screen-show",
        };
    }
}

const displayScreen = (screen, params) => {
    if (currentScreen) {
        currentScreen.hide();
        currentScreen.stopLoop();
    }

    screen.show();
    screen.fire(new ScreenEvent(ScreenEvent.events.show, currentScreen, screen, params));
    screen.startLoop();
    currentScreen = screen;
};

const prepareScreens = async (...args) => {
    const builders = {
        [screenIds.title]: titleBuilder,
        [screenIds.levelSelection]: levelSelectionBuilder,
        [screenIds.game]: gameBuilder,
    };

    const all = {};
    Object.keys(builders).forEach((key) => {
        const screen = builders[key](...args);
        screen.id = key;
        screen.on(ScreenEvent.events.change, event => displayScreen(all[event.to], event.params), true);

        if (DEV) {
            screen.on(Scene.events.draw, () => {
                if (screen === currentScreen && screen.fps && screen.fps < 30) {
                    console.warn(`Dip in FPS to ${screen.fps.toFixed(0)} in ${screen.id}`);
                }
            }, true);
        }

        screen.hide();
        all[key] = screen;
    });

    return all;
};

export {
    screenIds,
    prepareScreens,
    displayScreen,
    ScreenEvent,
};
