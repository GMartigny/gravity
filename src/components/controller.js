import { Container, Button, MouseEvent, BaseEvent } from "pencil.js";

const stateKey = Symbol("_state");
const playButtonKey = Symbol("_playButton");

export default class Controller extends Container {
    constructor (position) {
        super(position);

        const stopButton = new Button([0, 0], {
            value: "Clear",
        });
        stopButton.on(MouseEvent.events.click, () => {
            this.fire(new BaseEvent(Controller.events.clear, this));
        });

        const playButton = new Button();
        playButton.on(MouseEvent.events.click, () => {
            this.state = this.state === Controller.PLAY ? Controller.STOP : Controller.PLAY;
            if (this.state === Controller.STOP) {
                this.fire(new BaseEvent(Controller.events.reset, this));
            }
        });

        this.add(stopButton, playButton);

        this[playButtonKey] = playButton;

        this.state = Controller.STOP;

        const margin = 10;
        stopButton.position.set(-stopButton.background.width - margin, 0);
        playButton.position.set(margin, 0);
    }

    get state () {
        return this[stateKey];
    }

    set state (state) {
        this[stateKey] = state;
        this[playButtonKey].value = this.state === Controller.PLAY ? "Reset" : "Play";
    }

    static get events () {
        return {
            clear: "clear",
            reset: "reset",
        };
    }
}

Controller.STOP = 0;
Controller.PLAY = 1;
