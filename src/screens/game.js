/* globals DEV */

import { Scene, MouseEvent, Position, Vector, Text, Select, Button, Math as M } from "pencil.js";
import Save from "../save";
import verlet from "../verlet";
import { gravity } from "../constants";
import { ScreenEvent, screens } from "../screens";
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

    let currentLevel = 0;
    const saved = Save.get("level") || [];

    const backButton = new Button([10, 10], {
        font,
        fontSize: 20,
        value: "🡄",
    });
    backButton.on(MouseEvent.events.click, () => {
        scene.fire(new ScreenEvent(ScreenEvent.events.change, scene, screens.levelSelection));
    });

    const levelIndicator = new Text([scene.width - 10, 10], "", {
        font,
        fill: "#222",
        fontSize: 20,
        align: Text.alignments.right,
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

    scene.add(
        backButton,
        levelIndicator,
        // scoreIndicator,
        controller,
        ball,
        portal,
    );

    /**
     * Write score to the view
     */
    function setScore () {
        const score = [...walls].reduce((acc, wall) => {
            if (wall.type !== Wall.types.unmovable) {
                return acc + wall.length;
            }
            return acc;
        }, 0);
        scoreIndicator.text = score.toFixed(0);
    }

    /**
     * Reset the view
     */
    function reset () {
        controller.state = Controller.STOP;
        ball.position.set(ball.startingPosition);
        ball.previousPosition = null;
    }

    /**
     * Clear the view
     * @param {Boolean} force - Clear everything
     */
    function clear (force) {
        ball.startingPosition.set(levelsData[currentLevel].start);
        portal.position.set(levelsData[currentLevel].end);
        reset();

        walls.forEach((wall) => {
            if (force || wall.type !== Wall.types.unmovable) {
                wall.delete();
                walls.delete(wall);
            }
        });
        setScore();
    }

    controller.on(Controller.events.reset, () => reset())
        .on(Controller.events.clear, () => clear());

    /**
     * Setup the view
     */
    function setup () {
        const currentData = levelsData[currentLevel];
        if (currentData) {
            levelIndicator.text = `${currentLevel + 1} / ${levelsData.length}`;
            clear(true);

            currentData.walls.forEach((data) => {
                const wall = new Wall(...data);
                walls.add(wall);
                scene.add(wall);
            });

            const savedData = saved[currentLevel];
            if (savedData) {
                savedData.forEach((data) => {
                    const wall = new Wall(...data, Wall.types.user);
                    walls.add(wall);
                    scene.add(wall);
                });
            }
        }
    }

    /**
     * Win this level
     */
    function win () {
        reset();
        if (levelsData[currentLevel + 1]) {
            currentLevel += 1;
            setup();
        }
    }

    /**
     * Save current level
     */
    function saveCurrentLevel () {
        saved[currentLevel] = [...walls].filter(wall => wall.type !== Wall.types.unmovable);
        Save.store("level", saved);
    }

    if (DEV) {
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
            currentLevel = +levelSelector.value;
            setup();
        });
        scene.add(levelSelector);
    }

    const getForces = (yarn) => {
        const forces = new Position();

        forces.add(gravity);

        walls.forEach((wall) => {
            const closest = (new Vector(wall.position, wall.to)).getClosestToPoint(yarn.position);
            const distance = yarn.position.distance(closest);
            const field = yarn.radius + (wall.width / 2);
            if (distance < field) {
                const pushBack = yarn.position.clone()
                    .subtract(closest)
                    .divide(distance)
                    .multiply(distance - field)
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
            ({ level: currentLevel } = event.params);
            setup();
        })
        .on(MouseEvent.events.down, (event) => {
            draw = new Wall(event.position, undefined, Wall.types.user);
            draw.options.opacity = 0.7;
        }, true)
        .on(MouseEvent.events.move, (event) => {
            if (draw) {
                if (M.equals(event.position.x, draw.position.x, minDraw)) {
                    event.position.x = draw.position.x;
                }
                if (M.equals(event.position.y, draw.position.y, minDraw)) {
                    event.position.y = draw.position.y;
                }
                if (event.position.distance(draw.position) > minDraw) {
                    draw.to = event.position;
                }
                if (!draw.parent && draw.length > minDraw) {
                    scene.add(draw);
                }
            }
        })
        .on(MouseEvent.events.up, () => {
            if (draw) {
                if (draw.length >= minDraw) {
                    draw.options.opacity = 1;
                    walls.add(draw);
                    setScore();
                    saveCurrentLevel();
                    draw.on(MouseEvent.events.drop, saveCurrentLevel, true);
                }
                else {
                    draw.delete();
                }
            }
            draw = null;
        })
        .on(Wall.events.remove, (event) => {
            const { target } = event;
            walls.delete(target);
            target.delete();
            setScore();
            saveCurrentLevel();
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
