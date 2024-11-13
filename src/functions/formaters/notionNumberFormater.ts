export function NotionNumberFormater (value: number): string {
    const numberString = String(value);
    if (numberString.includes('.')) {
        return numberString.replace('.', ',')
    } else {
        return numberString + ",00"
    }
}