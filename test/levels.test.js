import test from "ava";
import levelData from "../src/levels";

test("All levels have start, end and walls", (t) => {
    levelData.forEach((level) => {
        t.true(Array.isArray(level.start));
        t.true(Array.isArray(level.end));
        t.true(Array.isArray(level.walls));
    });
});
