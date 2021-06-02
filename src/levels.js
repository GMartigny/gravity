import { RegularPolygon } from "pencil.js";

const openCirc = (n, radius, start = 0) => {
    const points = RegularPolygon.getRotatingPoints(n, radius, start);
    const walls = [];
    for (let i = 0; i < n - 1; ++i) {
        walls.push(points.slice(i, i + 2));
    }
    return walls;
};

export default [
    () => ({
        walls: [
            ...openCirc(4, 100),
            ...openCirc(6, 200, 0.5),
            ...openCirc(8, 300),
            ...openCirc(10, 400, 0.5),
            ...openCirc(12, 500),
            ...openCirc(14, 600, 0.5),
            ...openCirc(16, 700),
        ],
        holes: [
            [0, 150],
            [0, 250],
            [0, 350],
            [0, 450],
            [0, 550],
            [0, 650],
        ],
    }),
];
