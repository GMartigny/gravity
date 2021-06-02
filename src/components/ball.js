import { Circle, RadialGradient, Color } from "pencil.js";

export default class Ball extends Circle {
    constructor (position) {
        const radius = 20;
        super(position, radius);

        const color = new Color(1, 0, 0);
        this.options.fill = new RadialGradient([-radius / 3, -radius / 3], radius, {
            0: color.clone().lightness(0.8),
            1: color,
        });

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
