import browserEnv from "browser-env";

browserEnv(["window", "document"], {
    url: "https://whatever.com",
    pretendToBeVisual: true,
});

window.HTMLCanvasElement.prototype.getContext = function getContext () {
    const noop = () => {};
    return {
        canvas: this,
        clearRect: noop,
        getImageData: noop,
        putImageData: noop,
        save: noop,
        restore: noop,
        translate: noop,
        rotate: noop,
        scale: noop,
        setTransform: noop,
        measureText: () => ({
            width: 5,
        }),
    };
};
