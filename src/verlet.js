import { friction } from "./constants";

/**
 * Do Verlet's integration of movement
 * @param {Object} component
 * @param {Function} getForces
 */
export default (component, getForces) => {
    const previous = component.position.clone();

    if (!component.isDragged) {
        if (component.previousPosition) {
            component.position.add(
                component.position.clone()
                    .subtract(component.previousPosition)
                    .multiply(1 - friction),
            );
        }
    }

    component.position.add(getForces(component));

    component.previousPosition = previous;
};
