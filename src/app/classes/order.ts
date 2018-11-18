import { DishOption } from './dish-option';
import * as moment from 'moment';

export class Order {
    date: moment.Moment;
    name: string;
    options: DishOption[];

    constructor(date: string, name: string, options: DishOption[]) {
        this.date = moment(date);
        this.name = name;
        this.options = options;
    }
}
