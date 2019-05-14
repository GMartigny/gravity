import { Scene, Container, Rectangle, Slider, Text, MouseEvent, Line, Circle } from "pencil.js";
import { ScreenEvent, screens } from "../screens";
import levelsData from "../levels";

export default (canvas, media) => {
    const { font } = media;

    const scene = new Scene(canvas, {
        fill: "#aa4ec2",
    });

    const previewsContainer = new Container();

    const margin = 30;
    const width = 240;
    const height = 180;
    const fontSize = height * 0.7;
    const bound = width + (margin * 2);
    const previews = levelsData.map((level, index) => {
        const preview = new Rectangle([(bound / 2) + (index * bound), scene.height / 2], width, height, {
            fill: "#8cdff2",
            origin: Rectangle.origins.center,
            cursor: Rectangle.cursors.pointer,
        });
        preview
            .on(MouseEvent.events.click, () => {
                scene.fire(new ScreenEvent(ScreenEvent.events.change, scene, screens.game, {
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
        preview.add(nb);

        return preview;
    });
    const totalWidth = previews.length * (width + 2 * margin) - scene.width;

    previewsContainer.add(...previews);

    const scroller = new Slider([0, (scene.height / 2) + (height / 2) + margin], {
        min: 0,
        max: 1,
        value: 0,
        width: scene.width,
    });
    scroller.on(Slider.events.change, () => {
        previewsContainer.position.set(-scroller.value * totalWidth, 0);
    });

    scene.add(previewsContainer, scroller);

    return scene;
};
