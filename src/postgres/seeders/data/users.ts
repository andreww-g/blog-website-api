import { faker } from '@faker-js/faker/locale/ar';
import { DeepPartial } from 'typeorm';
import * as _ from 'lodash';

import { PasswordService } from '../../../common/services/password.service';
import { UserEntity } from '../../../user/entities/user.entity';

// Using index parameter to create deterministic emails
export const users: Omit<DeepPartial<UserEntity>, 'createdAt' | 'updatedAt' | 'deletedAt'>[] = _.times(50, (index) => ({
  id: faker.string.uuid(),
  email: `author${index + 1}@blog.com`,
  password: PasswordService.hashPasswordSync('password'),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));
