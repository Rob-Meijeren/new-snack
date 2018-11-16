export class OptionLevel {
    name: string;
    level: number;
    required: boolean;
    max: number;

    constructor(name: string, level: number, required: number, max: number) {
        this.name = name;
        this.level = level;
        this.required = Boolean(--required);
        this.max = max;
    }
}
