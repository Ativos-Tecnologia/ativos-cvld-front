export function generateColor(index: number, total: number) {
    const hue = (index * (360 / total)) % 360;
    return `hsl(${hue}, 60%, 50%)`;
}
