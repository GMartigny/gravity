import { BaseEvent } from "pencil.js";

// Screens
import titleBuilder from "./screens/title";
import levelSelectionBuilder from "./screens/level-selection";
import gameBuilder from "./screens/game";

let currentScreen = null;

const screens = {
    title: "title",
    levelSelection: "levelSelection",
    game: "game",
};

class ScreenEvent extends BaseEvent {
    constructor (eventName, target, to, params = {}) {
        super(eventName, target);
        this.to = to;
        this.params = params;
    }

    static get events () {
        return {
            change: "change",
            show: "show",
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
        [screens.title]: titleBuilder,
        [screens.levelSelection]: levelSelectionBuilder,
        [screens.game]: gameBuilder,
    };

    const all = {};
    Object.keys(builders).forEach((key) => {
        const screen = builders[key](...args);
        screen.on(ScreenEvent.events.change, event => displayScreen(all[event.to], event.params), true);
        screen.hide();
        all[key] = screen;
    });

    return all;
};

export {
    screens,
    prepareScreens,
    displayScreen,
    ScreenEvent,
};
