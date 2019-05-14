import { Scene, Text, Button, MouseEvent, Position, Vector } from "pencil.js";
import { ScreenEvent, screens } from "../screens";
import { gravity } from "../constants";
import verlet from "../verlet";
import Wall from "../components/wall";

export default (canvas, media) => {
    const { font } = media;
    const scene = new Scene(canvas, {
        fill: "#6266eb",
    });

    const fontSize = 80;
    const titlePosition = [scene.width / 2, -fontSize];
    const title = new Text(titlePosition, "Gravity", {
        font,
        fontSize,
        fill: Wall.types.unmovable.color,
        align: Text.alignments.center,
        origin: [0, -fontSize / 2],
    });
    title.draggable();

    const wall = new Wall(scene.center.subtract(title.width / 2, 0), scene.center.add(title.width / 2, 0));

    const gameButton = new Button(scene.center.add(0, 100), {
        value: "Play",
    });
    gameButton
        .on(MouseEvent.events.click, () => {
            scene.fire(new ScreenEvent(ScreenEvent.events.change, scene, screens.levelSelection));
        });

    const getForces = () => {
        const forces = new Position();

        forces.add(gravity);

        const closest = (new Vector(
            wall.position.clone().subtract(title.width / 2, 0),
            wall.to.clone().add(title.width / 2, 0),
        )).getClosestToPoint(title.position);
        const distance = closest.distance(title.position);
        const field = (title.height / 2) + (wall.width / 2) + 5;
        if (distance < field) {
            const pushBack = closest
                .subtract(title.position)
                .divide(distance)
                .multiply(distance - field)
                .multiply(wall.elasticity);
            forces.add(pushBack);
        }

        return forces;
    };

    scene.add(wall, title, gameButton)
        .on(Scene.events.draw, () => {
            verlet(title, getForces);

            if (title.position.distance(scene.center) > scene.width) {
                title.position.set(...titlePosition);
            }
        }, true);

    return scene;
};
