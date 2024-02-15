import { CreateOrderDto } from 'src/modules/orders/dto/create-order.dto';

export const newOrderMessage = (order: CreateOrderDto): string => {
  const { items, customer, total } = order;

  const orderItems = items
    .map(({ productName, quantity }) => `${productName} - ${quantity}шт.`)
    .join('\n');

  const message =
    '<b>&#8252;Нове замовлення&#8252;</b>\n' +
    `&#128100;  ${customer.name}\n` +
    `&#128241; <a href="tel:${customer.phone}">${customer.phone}</a>\n` +
    `&#129534; ${total}грн.\n` +
    '<i>Замовлення:</i>\n' +
    orderItems;
  return message;
};
