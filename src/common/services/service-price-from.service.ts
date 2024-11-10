import { InternalServerErrorException, Logger } from '@nestjs/common';
import {
  DATE_FORMAT,
  DATE_FORMAT_DAY,
  DATE_FORMAT_TIME,
  DATE_FORMAT_WEEKDAY,
  IContext,
  PriceCalculationService,
} from '@sky-vip/price-calculation-service';
import { min } from 'lodash';
import { DateTime } from 'luxon';

import { ServiceEntity } from '../../services/entities/service.entity';
import { ReceptionTypeEnum } from '../enums/reception-type.enum';


export class ServicePriceFromService {
  protected static logger = new Logger(this.constructor.name);

  public static calculateServicePriceFrom (service: Partial<ServiceEntity>): number {
    if (!service.airportIATA) throw new Error('Service has no airportIATA');
    if (!service.meeting) throw new Error('Service has no meeting groups');

    const calculationService = new PriceCalculationService();
    const serviceDate = DateTime.fromISO('2020-02-01T16:30:00.000Z', { zone: 'utc' });

    const context: IContext = {
      price: 0,
      counters: {
        adults: 1,
        children: 0,
        luggagePieces: 0,
        connectionHours: 0,
        hoursBeforeService: 7 * 24,
      },
      variables: {
        serviceDate: serviceDate.toFormat(DATE_FORMAT),
        serviceDay: serviceDate.toFormat(DATE_FORMAT_DAY),
        serviceTime: serviceDate.toFormat(DATE_FORMAT_TIME),
        serviceWeekday: serviceDate.toFormat(DATE_FORMAT_WEEKDAY),
        orderDate: serviceDate.minus({ days: 7 }).toFormat(DATE_FORMAT),
      },
    };

    try {
      const prices = Object.values(ReceptionTypeEnum).map((receptionType) => {
        if (!service.meeting) throw new InternalServerErrorException('Service has no meeting groups');
        const group = service.meeting.find((group) => group.receptionTypes.includes(receptionType));

        if (!group) return Number.POSITIVE_INFINITY;

        return calculationService.getTotal(context, group.priceBlocks)
          + calculationService.getTotal(context, group.feesBlocks);
      });

      return min(prices) || 0;

    } catch (error) {
      const message = `Error while calculating price for ${ service.airportIATA }: ${error.message}`;

      ServicePriceFromService.logger.error(message, context);
      throw new Error(message);
    }
  }
}
