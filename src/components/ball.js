import { Circle, RadialGradient, Position } from "pencil.js";

export default class Ball extends Circle {
    constructor (position) {
        const radius = 20;
        super(position, radius);

        this.options.fill = new RadialGradient([-radius / 3, -radius / 3], radius, {
            0: "#ff8080",
            1: "#ff0000",
        });

        this.startingPosition = new Position();
        this.previousPosition = null;
    }

    static get defaultOptions () {
        return {
            ...super.defaultOptions,
            shadow: {
                position: [4, 4],
                blur: 8,
                color: "rgba(20, 20, 20, .5)",
            },
        };
    }
}
