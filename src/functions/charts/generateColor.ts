export function generateColor(
    color: 'red' | 'yellow' | 'green' | 'lightgreen',
    index: number,
    steps: number,
) {
    const baseHues = {
        red: 0,
        yellow: 60,
        green: 120,
        lightgreen: 150,
    };

    const baseHue = baseHues[color];
    const saturation = 70;

    const minLightness = 25;
    const maxLightness = 55;
    const stepSize =
        steps > 1
            ? (maxLightness - minLightness) / (steps - 1)
            : (maxLightness - minLightness) / steps;

    const lightness = maxLightness - index * stepSize;

    return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
}
