import { Circle, RadialGradient } from "pencil.js";

export default class Portal extends Circle {
    constructor (position) {
        const radius = 30;
        super(position, radius, {
            fill: new RadialGradient([0, 0], radius, {
                0: "rgba(255, 255, 255, 0)",
                1: "#0069ff",
            }),
        });
    }
}
