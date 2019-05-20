import { Scene, Button, Container, Rectangle, Slider, Text, MouseEvent, Line, Circle } from "pencil.js";
import { ScreenEvent, screenIds } from "../screens";
import levelsData from "../levels";

export default (canvas, media = {}) => {
    const { font } = media;

    const scene = new Scene(canvas, {
        fill: "#aa4ec2",
    });

    const backButton = new Button([10, 10], {
        font,
        fontSize: 20,
        value: "🡄",
    });
    backButton.on(MouseEvent.events.click, () => {
        scene.fire(new ScreenEvent(ScreenEvent.events.change, scene, screenIds.title));
    });

    const previewsContainer = new Container();

    const margin = 30;
    const width = 240;
    const height = 180;
    const ratio = 180 / 900;
    const fontSize = height * 0.7;
    const bound = width + (margin * 2);
    const previews = levelsData.map((level, index) => {
        const preview = new Rectangle([(index * bound) + (bound / 2), scene.height / 2], width, height, {
            fill: "#8cdff2",
            origin: Rectangle.origins.center,
            cursor: Rectangle.cursors.pointer,
        });
        preview
            // .on(MouseEvent.events.hover, () => preview.options.scale.set(1.1))
            // .on(MouseEvent.events.leave, () => preview.options.scale.set(1))
            .on(MouseEvent.events.click, () => {
                scene.fire(new ScreenEvent(ScreenEvent.events.change, scene, screenIds.game, {
                    level: index,
                }));
            });

        const nb = new Text(undefined, `${index + 1}`, {
            font,
            fontSize,
            origin: [0, -fontSize / 2],
            opacity: 0.5,
            align: Text.alignments.center,
            cursor: Rectangle.cursors.pointer,
        });
        const origin = preview.getOrigin();
        preview.add(
            new Circle(level.start.map(n => n * ratio), 20 * ratio, {
                fill: "red",
                origin,
            }),
            new Circle(level.end.map(n => n * ratio), 20 * ratio, {
                fill: "blue",
                origin,
            }),
            ...level.walls.map((wall) => {
                const position = wall[0].map(n => n * ratio);
                return new Line(position, [wall[1].map((n, i) => n * ratio - position[i])], {
                    stroke: "#222",
                    strokeWidth: 12 * ratio,
                    origin,
                });
            }),
            nb,
        );

        return preview;
    });
    const totalWidth = previews.length * (width + 2 * margin) - scene.width;

    previewsContainer.add(...previews);

    const scroller = new Slider([margin, (scene.height / 2) + (height / 2) + margin], {
        min: 0,
        max: 1,
        value: 0,
        width: scene.width - (margin * 2),
    });
    scroller.on(Slider.events.change, () => {
        previewsContainer.position.set(-scroller.value * totalWidth, 0);
    });

    scene.add(
        backButton,
        previewsContainer,
        scroller,
    );

    return scene;
};
