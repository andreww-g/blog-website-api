import { faker } from '@faker-js/faker/locale/ar';
import { DeepPartial } from 'typeorm';

import { PublisherEntity } from '../../../publisher/entities/publisher.entity';
import { articles } from './articles';
import { authors } from './authors';

export const publishers: Omit<
  DeepPartial<PublisherEntity>,
  'createdAt' | 'updatedAt' | 'deletedAt'
>[] = [
  {
    id: faker.string.uuid(),
    authorId: authors[0].id,
    articles: articles.map((article) => ({
      ...article,
      publisherId: faker.string.uuid(),
    })),
  },
];
