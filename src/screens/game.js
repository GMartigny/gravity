/* globals EDITOR */

import { Scene, MouseEvent, Position, Vector, Text, Select, Button, Math as M } from "pencil.js";
import verlet from "../verlet";
import { gravity } from "../constants";
import { ScreenEvent } from "../screens";
import Controller from "../components/controller";
import Wall from "../components/wall";
import Ball from "../components/ball";
import Portal from "../components/portal";
import levelsData from "../levels";

export default (canvas, media) => {
    const { font } = media;

    const scene = new Scene(canvas, {
        fill: "#8cdff2",
    });

    let level = 0;

    const levelIndicator = new Text([10, 10], "", {
        font,
        fill: "#222",
        fontSize: 20,
    });
    const scoreIndicator = new Text([10, 35], "0", {
        font,
        fill: "#222",
        fontSize: 12,
    });
    const controller = new Controller([scene.width / 2, scene.height - 100]);
    const ball = new Ball();
    const portal = new Portal();
    const walls = new Set();

    scene.add(levelIndicator, scoreIndicator, controller, ball, portal);

    function setScore () {
        const score = [...walls].reduce((acc, wall) => {
            if (wall.type !== Wall.types.unmovable) {
                return acc + wall.length;
            }
            return acc;
        }, 0);
        scoreIndicator.text = score.toFixed(0);
    }

    function reset () {
        controller.state = Controller.STOP;
        ball.position.set(ball.startingPosition);
        ball.previousPosition = null;
    }

    function clear (force) {
        ball.startingPosition.set(levelsData[level].start);
        portal.position.set(levelsData[level].end);
        reset();

        walls.forEach((wall) => {
            if (force || wall.type !== Wall.types.unmovable) {
                wall.delete();
                walls.delete(wall);
            }
        });
    }

    controller.on(Controller.events.reset, () => reset())
        .on(Controller.events.clear, () => clear());

    function setup () {
        const currentData = levelsData[level];
        if (currentData) {
            levelIndicator.text = `${level + 1} / ${levelsData.length}`;
            clear(true);

            currentData.walls.forEach((data) => {
                const wall = new Wall(...data);
                walls.add(wall);
                scene.add(wall);
            });
        }
    }

    function win () {
        reset();
        if (levelsData[level + 1]) {
            level += 1;
            setup();
        }
    }

    if (EDITOR) {
        console.warn("You are in editor mode !");

        ball.draggable();
        ball.on(MouseEvent.events.drag, () => ball.startingPosition.set(ball.position));
        portal.draggable();

        const exportButton = new Button([0, scene.height / 2], {
            value: "Export",
        });
        exportButton.on(MouseEvent.events.click, () => {
            const data = {
                start: ball.position,
                end: portal.position,
                walls: [...walls],
            };
            console.log(JSON.stringify(data));
        });
        scene.add(exportButton);

        const levelSelector = new Select([exportButton.background.width, scene.height / 2], Object.keys(levelsData));
        levelSelector.on(Select.events.change, () => {
            level = +levelSelector.value;
            setup();
        });
        scene.add(levelSelector);
    }

    const getForces = () => {
        const forces = new Position();

        forces.add(gravity);

        walls.forEach((wall) => {
            const closest = (new Vector(wall.position, wall.to)).getClosestToPoint(ball.position);
            const distance = ball.position.distance(closest);
            if (distance < ball.radius + 6) {
                const pushBack = ball.position.clone()
                    .subtract(closest)
                    .divide(distance)
                    .multiply(distance - (ball.radius + (wall.width / 2)))
                    .multiply(-wall.elasticity);
                forces.add(pushBack);
            }
        });

        return forces;
    };

    let draw = null;
    const minDraw = 12;
    scene
        .on([ScreenEvent.events.show, ScreenEvent.events.change], (event) => {
            console.log(event);
            ({ level } = event.params);
            setup();
        })
        .on(MouseEvent.events.down, (event) => {
            draw = new Wall(event.position, undefined, Wall.types.user);
            draw.options.opacity = 0.7;
            draw.on(MouseEvent.events.click, (e) => {
                const { target } = e;
                walls.delete(target);
                target.delete();
                setScore();
            }, true);
        }, true)
        .on(MouseEvent.events.move, (event) => {
            if (draw) {
                if (M.equals(event.position.x, draw.position.x, minDraw)) {
                    event.position.x = draw.position.x;
                }
                if (M.equals(event.position.y, draw.position.y, minDraw)) {
                    event.position.y = draw.position.y;
                }
                draw.to = event.position;
                if (!draw.parent && draw.length > minDraw) {
                    scene.add(draw);
                }
            }
        })
        .on(MouseEvent.events.up, () => {
            if (draw) {
                if (draw.length > minDraw) {
                    draw.options.opacity = 1;
                    walls.add(draw);
                    setScore();
                }
                else {
                    draw.delete();
                }
            }
            draw = null;
        })
        .on(Scene.events.draw, () => {
            if (controller.state === Controller.PLAY) {
                verlet(ball, getForces);

                ball.options.rotation += (ball.position.x - ball.previousPosition.x) / 100;

                if (ball.previousPosition.distance(portal.position) < ball.radius + portal.radius) {
                    win();
                }
            }
        }, true);

    return scene;
};
