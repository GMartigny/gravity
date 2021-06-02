import { Circle } from "pencil.js";

export default class Hole extends Circle {
    constructor (position) {
        super(position, 20);
    }

    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            fill: "#999",
        };
    }
}
