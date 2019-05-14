import "./style.css";
import loader from "./loader";
import { prepareScreens, displayScreen } from "./screens";
import { version, author, homepage, bugs } from "../package";

const prepare = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 900;
    document.body.appendChild(canvas);
    return prepareScreens(
        canvas,
        await loader(),
    );
};

(async () => {
    console.log(`Gravity v${version} made with love by ${author}`);
    console.log(`Hi, wanna get technical ? Go to ${homepage}.`);
    console.log(`If you want to report a bug or request a feature, you can do so at ${bugs.url}`);
    const screens = await prepare();
    displayScreen(screens.title);
})();
