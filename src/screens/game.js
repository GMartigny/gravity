/* globals DEV */

import { Scene, MouseEvent, Position, Vector, Text, Select, Button, Container, Circle, Math as M } from "pencil.js";
import verlet from "../verlet";
import { gravity } from "../constants";
import { ScreenEvent, screenIds } from "../screens";
import Wall from "../components/wall";
import Ball from "../components/ball";
import Hole from "../components/hole";
import levels from "../levels";

export default (canvas, media = {}) => {
    const { font } = media;

    const scene = new Scene(canvas, {
        fill: "#8cdff2",
    });

    const scaler = new Container(scene.center);

    const spinner = new Container();

    let currentLevel = 0;

    const backButton = new Button([10, 10], {
        font,
        fontSize: 20,
        value: "🡄",
    });
    backButton.on(MouseEvent.events.click, () => {
        scene.fire(new ScreenEvent(ScreenEvent.events.change, scene, screenIds.levelSelection));
    });

    const levelIndicator = new Text([scene.width - 10, 10], "", {
        font,
        fill: "#222",
        fontSize: 20,
        align: Text.alignments.right,
    });
    const ball = new Ball();
    const walls = new Set();
    const holes = [];

    scaler.add(
        ball,
        spinner,
    );
    scene.add(
        scaler,
        backButton,
        levelIndicator,
        new Circle(scene.center, 4),
    );

    const resetBall = () => {
        ball.position.set(0);
        if (ball.previousPosition) {
            ball.previousPosition.set(0);
        }
    };

    const clear = () => {
        walls.clear();
        holes.length = 0;
        spinner.empty();
        resetBall();
    };

    /**
     * Setup the view
     */
    function setup () {
        const currentData = levels[currentLevel];
        if (currentData) {
            clear();
            levelIndicator.text = `${currentLevel + 1} / ${levels.length}`;

            const data = currentData();
            data.walls.forEach((pos) => {
                const wall = new Wall(...pos);
                walls.add(wall);
                spinner.add(wall);
            });

            data.holes.forEach((pos) => {
                const hole = new Hole(pos);
                holes.push(hole);
                spinner.add(hole);
            });
        }
    }

    /**
     * Win this level
     */
    // function win () {
    //     reset();
    //     if (levelsData[currentLevel + 1]) {
    //         currentLevel += 1;
    //         setup();
    //     }
    // }

    // if (DEV) {
    //     console.warn("You are in editor mode !");
    //
    //     ball.draggable();
    //     ball.on(MouseEvent.events.drag, () => ball.startingPosition.set(ball.position));
    //     portal.draggable();
    //
    //     const exportButton = new Button([0, scene.height / 2], {
    //         value: "Export",
    //     });
    //     exportButton.on(MouseEvent.events.click, () => {
    //         const data = {
    //             start: ball.position,
    //             end: portal.position,
    //             walls: [...walls],
    //         };
    //         console.log(JSON.stringify(data));
    //     });
    //     scene.add(exportButton);
    //
    //     const levelSelector = new Select([exportButton.background.width, scene.height / 2], Object.keys(levelsData));
    //     levelSelector.on(Select.events.change, () => {
    //         currentLevel = +levelSelector.value;
    //         setup();
    //     });
    //     scene.add(levelSelector);
    // }

    const getForces = (moving) => {
        const forces = new Position();

        forces.add(gravity);

        walls.forEach((wall) => {
            const absolute = [
                wall.position.clone(),
                wall.to,
            ].map(pos => pos.rotate(spinner.options.rotation).add(spinner.position));
            const absoluteVector = new Vector(...absolute);
            const closest = absoluteVector.getClosestToPoint(moving.position);
            const distance = moving.position.distance(closest);
            const field = moving.radius + (wall.width / 2);
            if (distance < field) {
                const pushBack = moving.position.clone()
                    .subtract(closest)
                    .divide(distance)
                    .multiply(distance - field)
                    .multiply(-wall.elasticity);
                forces.add(pushBack);
            }
        });

        return forces;
    };

    const setScale = () => {
        const distance = ball.position.distance();
        const ratio = Math.min(2, (scene.height / 2.5) / distance);

        scaler.options.scale.lerp([ratio, ratio], 0.1);
    };

    const lerp = (from, to, ratio) => from + ((to - from) * ratio);

    const setRotation = (position) => {
        const vector = position.clone()
            .subtract(scene.center);
        const { rotation } = spinner.options;
        const target = Math.atan2(vector.y, vector.x) / M.radianCircle + 0.75;

        const round = Math.round(rotation);
        const poss = [round - 1, round, round + 1].map(x => x + target);
        const diffs = poss.map(x => Math.abs(x - rotation));
        const min = Math.min(...diffs);
        const minIndex = diffs.indexOf(min);

        spinner.options.rotation = lerp(rotation, poss[minIndex], 0.1);
    };

    scene
        .on(ScreenEvent.events.show, (event) => {
            currentLevel = event.params.level;
            setup();
        })
        .on(Scene.events.draw, () => {
            const fall = holes.some((hole) => {
                const absolute = hole.position.clone().rotate(spinner.options.rotation).add(spinner.position);
                return absolute.distance(ball.position) < (ball.radius + hole.radius);
            });
            if (fall) {
                resetBall();
            }

            setScale();
            setRotation(scene.cursorPosition);
            verlet(ball, getForces);

            ball.options.rotation += (ball.position.x - ball.previousPosition.x) / 100;

            // if (ball.previousPosition.distance(portal.position) < ball.radius + portal.radius) {
            //     win();
            // }
            // }
        }, true);

    return scene;
};
