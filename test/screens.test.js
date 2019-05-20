import test from "ava";
import { Scene } from "pencil.js";
import gameScreen from "../src/screens/game";
import levelScreen from "../src/screens/level-selection";
import titleScreen from "../src/screens/title";
import { screenIds } from "../src/screens";

const screenBuilders = [gameScreen, levelScreen, titleScreen];

test("All screen exports a Scene", (t) => {
    global.DEV = false;
    screenBuilders.forEach((builder) => {
        const screen = builder();
        t.true(screen instanceof Scene);
        t.true(screen.children.length > 0);
    });
});

test("All screens are exported", (t) => {
    t.is(Object.keys(screenIds).length, screenBuilders.length);
});
