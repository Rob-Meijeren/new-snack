import { Injectable } from '@angular/core';
import { Order } from '../classes/order';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { DishOption } from '../classes/dish-option';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  downloadOrdersAsExcel(orders: any[]) {
    const parsedOrders = {};

    orders.forEach((order) => {
      const tmpOrder = {
        name: order.name
      };
      order.options.forEach((orderOption, index) => {
        tmpOrder['option ' + index] = orderOption.name;
      });
      if (!parsedOrders[order.options[0].company]) {
        parsedOrders[order.options[0].company] = [];
      }
      parsedOrders[order.options[0].company].push(tmpOrder);
    });

    const wb = XLSX.utils.book_new();

    Object.keys(parsedOrders).forEach(function(key) {
      const ws = XLSX.utils.json_to_sheet(parsedOrders[key]);
      XLSX.utils.book_append_sheet(wb, ws, key);
    });

    const date = moment().format('YYYY-MM-DD');

    XLSX.writeFile(wb, 'Lunchlijst ' + date + '.xlsx');
  }
}
