import { OrderPassengerEntity } from '../../orders/entities/order-passenger.entity';
import { OrderEntity } from '../../orders/entities/order.entity';

import { formatDate } from './format-date';


const formatPaxName = (order: OrderEntity, isEmail: boolean): string => {
  let passenger: OrderPassengerEntity;

  passenger = order.passengers[order.passengers.length - 1];
  if (isEmail) passenger = order.passengers[0];

  const { firstName, lastName } = passenger ?? {};

  const countOfAdults = order.passengers.filter((passenger) => !passenger.isChild).length;
  const countOfChildren = order.passengers.filter((passenger) => passenger.isChild).length;

  let paxName = '';

  if (firstName || lastName) {
    paxName = `${firstName ?? ''} ${lastName ?? ''}.`.trim();
  }

  if (countOfAdults > 0) {
    paxName += ` Adults: ${countOfAdults}.`;
  }

  if (countOfChildren > 0) {
    paxName += ` Children: ${countOfChildren}.`;
  }

  return paxName || '-';
};

export const getOrderCsvColumns = ({ isEmail = false }: { isEmail?: boolean }):Record<string, (order: OrderEntity) => string | string[] | number | boolean> => ({
  'ORD/LEAD/BOOKED NAME': (order) => `${order.orderNumber}` + `${order.lead?.leadNumber
    ? `/${order.lead?.leadNumber}`
    : ''}` + `${(order.contact.firstName && order.contact.lastName)
    ? `/${order.contact.firstName} ${order.contact.lastName}`
    : '/-'}`,
  Email: (order) => order.contact.email ?? '-',
  'Pax name': (order) => formatPaxName(order, isEmail),
  Code: (order) => order.airportIATA,
  'Additional info': (order) => `service type: ${order.serviceType?.toString().toLowerCase()}` +
    ` | ${order.specialRequirements ?? '-'}`,
  Status: () => '',
  'CSR Name': (order) => order.dashboardInfo.orderOwner?.name ?? '-',
  Time: (order) => order.serviceTimeLocal ?? '-',
  Flight: (order) => `${order.arrivalFlight?.flightIATA ?? ''} ${order.departureFlight?.flightIATA ?? ''}`.trim(),
  'Date Of Service': (order) => order.serviceDateLocal,
  'Service Type': (order) => order.receptionType?.toString().toLowerCase() ?? '-',
  'Payment Received/USD': (order) => order.invoices.reduce((acc, invoice) => acc + invoice.total, 0),
  'Date of Payment': (order) => {
    const sortedInvoices = order.invoices.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return sortedInvoices.length > 0 ? formatDate(sortedInvoices[0].createdAt) : '-';
  },
  'Amount Paid to Greeters': () => '',
  'Invoice/Order Number': (order) => {
    const invoiceNumbers = order.invoices.map((i) => i.invoiceNumber).join(', ');

    return `${invoiceNumbers}/${order.orderNumber}` ?? '-';
  },
  'Session UUID': (order) => order.lead?.sessionUUID ? order.lead.sessionUUID : '-',
});
