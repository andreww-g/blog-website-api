import { faker } from '@faker-js/faker/locale/ar';
import { DeepPartial } from 'typeorm';

import { PasswordService } from '../../../common/services/password.service';
import { UserEntity } from '../../../user/entities/user.entity';

export const users: Omit<
  DeepPartial<UserEntity>,
  'createdAt' | 'updatedAt' | 'deletedAt'
>[] = [
  {
  id: faker.string.uuid(),
  email: 'author@gmail.com',
  password: PasswordService.hashPasswordSync('password'),
  avatar: {
    id: faker.string.uuid(),
    url: faker.image.avatar(),
    size: faker.number.float(),
    name: faker.string.alpha({ casing: 'lower', length: 10 }),
  },
  authorId: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
},
];
