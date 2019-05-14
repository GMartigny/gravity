import { Text } from "pencil.js";

export default async () => {
    const promises = [
        Text.load("https://fonts.gstatic.com/s/chango/v7/2V0cKI0OB5U7WaJCyHe5.woff2")
            .then(value => ({
                key: "font",
                value,
            })),
    ];
    const loaded = await Promise.all(promises)
        .then(results => results.reduce((object, result) => {
            object[result.key] = result.value;
            return object;
        }, {}));
    return loaded;
};
