import { DishOption } from './dish-option';

export class Dish {
    name: string;
    options: DishOption[];

    addOption(option: DishOption) {
        this.options.push(option);
    }
}
