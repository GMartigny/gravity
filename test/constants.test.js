import test from "ava";
import * as constants from "../src/constants";

test("Constants have correct values", (t) => {
    t.is(constants.friction, 0.003);

    t.is(constants.gravity.x, 0);
    t.is(constants.gravity.y, 0.12);
});
