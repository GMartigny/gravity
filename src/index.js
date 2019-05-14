import loader from "./loader";
import { prepareScreens, displayScreen } from "./screens";

const prepare = async () => prepareScreens(
    document.getElementById("scene"),
    await loader(),
);

(async () => {
    const screens = await prepare();
    displayScreen(screens.title);
})();
