import { Line, MouseEvent } from "pencil.js";

export default class Wall extends Line {
    constructor (from, to = from.clone(), type) {
        super(from, [to.subtract(from)]);

        this.type = type;
        this.options.stroke = type.color;
        this.options.strokeWidth = type.width;
        this.elasticity = type.elasticity;
        this.options.cursor = type.cursor;

        if (type !== Wall.types.unmovable) {
            this.draggable();
            this.on(MouseEvent.events.drag, () => this.options.opacity = 0.7)
                .on(MouseEvent.events.drop, () => this.options.opacity = 1);
        }
    }

    get to () {
        return this.points[0].clone().add(this.position);
    }

    set to (position) {
        this.points[0].set(position.subtract(this.position));
    }

    get width () {
        return this.options.strokeWidth;
    }

    get length () {
        return this.position.distance(this.to);
    }

    toJSON () {
        return [
            this.position,
            this.to,
        ];
    }
}

Wall.types = {
    unmovable: {
        color: "#222",
        elasticity: 0.4,
        width: 12,
        cursor: Line.cursors.default,
    },
    user: {
        color: "#555",
        elasticity: 0.4,
        width: 12,
        cursor: Line.cursors.pointer,
    },
    bouncy: {
        color: "#7e711f",
        elasticity: 0.7,
        width: 16,
        cursor: Line.cursors.pointer,
    },
};
