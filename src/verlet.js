import { friction } from "./constants";

export default (component, forces) => {
    const previous = component.position.clone();

    if (!component.isDragged) {
        if (component.previousPosition) {
            component.position.add(
                component.position.clone()
                    .subtract(component.previousPosition)
                    .multiply(1 - friction),
            );
        }

        component.position.add(forces());
    }

    component.previousPosition = previous;
};
