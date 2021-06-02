import { Line, Position } from "pencil.js";

/**
 * Wall class
 * @class
 */
export default class Wall extends Line {
    /**
     * Wall constructor
     * @param {PositionDefinition} from -
     * @param {PositionDefinition} to -
     * @param {WallType} type -
     */
    constructor (from, to, type = Wall.types.solid) {
        const toPosition = Position.from(to).clone();
        super(from, [toPosition.subtract(from)]);

        if (typeof type === "string") {
            type = Wall.types[type];
        }

        this.type = type;
        this.options.stroke = type.color;
        this.options.strokeWidth = type.width;
        this.elasticity = type.elasticity;

        // if (movable) {
        //     this.draggable();
        //     this.on(MouseEvent.events.drag, () => this.options.opacity = 0.7, true)
        //         .on(MouseEvent.events.drop, () => this.options.opacity = 1, true)
        //         .on(MouseEvent.events.click, () => this.fire(new BaseEvent(Wall.events.remove, this)), true);
        //
        //     const handleOptions = {
        //         fill: "red",
        //     };
        //     // FIXME
        //     const origin = this.position.clone();
        //     const dest = this.points[0].clone();
        //     const startHandle = new Circle([0, 0], type.width / 2, handleOptions);
        //     startHandle.draggable();
        //     startHandle
        //         .on(MouseEvent.events.drag, ({ position }) => {
        //             this.points[0].set(dest.clone().subtract(position));
        //             this.position.set(origin.clone().add(position));
        //             startHandle.position.set(0);
        //         })
        //         .on(MouseEvent.events.drop, () => {
        //             origin.set(this.position);
        //             dest.set(this.points[0]);
        //         });
        //     const endHandle = new Circle(this.points[0], type.width / 2, handleOptions);
        //     endHandle.draggable();
        //     endHandle.on(MouseEvent.events.drag, ({ position }) => this.points[0].set(position));
        //     this.add(startHandle, endHandle);
        // }
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
            Object.keys(Wall.types).find(type => type === this.type),
        ];
    }

    static get events () {
        return {
            remove: "wall-remove",
        };
    }
}

/**
 * @typedef {Object} WallType
 * @prop {String} color
 * @prop {Number} elasticity
 * @prop {Number} width
 */
/**
 * @type {{
 *     solid: WallType,
 *     bouncy: WallType,
 * }}
 */
Wall.types = {
    solid: {
        color: "#555",
        elasticity: 0.7,
        width: 20,
    },
    bouncy: {
        color: "#7e711f",
        elasticity: 0.1,
        width: 26,
    },
};
