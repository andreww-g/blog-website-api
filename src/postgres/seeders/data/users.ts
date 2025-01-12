import { faker } from '@faker-js/faker/locale/ar';
import { DeepPartial } from 'typeorm';
import * as _ from 'lodash';

import { PasswordService } from '../../../common/services/password.service';
import { UserEntity } from '../../../user/entities/user.entity';

export const users: Omit<DeepPartial<UserEntity>, 'createdAt' | 'updatedAt' | 'deletedAt'>[] = _.times(50, () => ({
  id: faker.string.uuid(),
  email: faker.helpers.arrayElement(['authors@blog.com', 'blog@authors.com', 'authors.blog@site.com']),
  password: PasswordService.hashPasswordSync('password'),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));
