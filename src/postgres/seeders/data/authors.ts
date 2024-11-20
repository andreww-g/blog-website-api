import { faker } from '@faker-js/faker/locale/ar';
import { DeepPartial } from 'typeorm';

import { AuthorEntity } from '../../../authors/entities/author.entity';

import { users } from './users';


export const authors: Omit<
  DeepPartial<AuthorEntity>,
  'createdAt' | 'updatedAt' | 'deletedAt'
>[] = [
  {
    id: faker.string.uuid(),
    description: faker.lorem.paragraph(2),
    userId: users[0].id,
  },
];
