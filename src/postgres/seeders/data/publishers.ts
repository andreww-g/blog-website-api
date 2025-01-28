import { faker } from '@faker-js/faker/locale/ar';
import { DeepPartial } from 'typeorm';
import * as _ from 'lodash';

import { PublisherEntity } from '../../../publishers/entities/publisher.entity';
import { users } from './users';

export const publisherAvatars = _.times(50, () => ({
  id: faker.string.uuid(),
  url: faker.image.avatar(),
  size: faker.number.float(),
  name: faker.string.alpha({ casing: 'lower', length: 10 }),
  mimeType: 'image/jpeg',
}));

export const publishers: Omit<DeepPartial<PublisherEntity>, 'createdAt' | 'updatedAt' | 'deletedAt'>[] = _.times(
  50,
  (index) => ({
    id: faker.string.uuid(),
    userId: users[index].id,
    user: users[index],
    avatarId: publisherAvatars[index].id,
  }),
);
