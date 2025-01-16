import { faker } from '@faker-js/faker/locale/ar';
import { DeepPartial } from 'typeorm';
import * as _ from 'lodash';

import { ArticleCategoryEntity } from '../../../article-category/entities/article-category.entity';
import { ArticleCategoryEnum } from '../../../common/enums/article-category.enum';

// Create a fixed number of categories with more meaningful names
export const articleCategories: Omit<
  DeepPartial<ArticleCategoryEntity>,
  'createdAt' | 'updatedAt' | 'deletedAt'
>[] = [
  {
    id: faker.string.uuid(),
    type: ArticleCategoryEnum.TECHNOLOGY,
    name: 'Technology News'
  },
  {
    id: faker.string.uuid(),
    type: ArticleCategoryEnum.BUSINESS,
    name: 'Business Insights'
  },
  {
    id: faker.string.uuid(),
    type: ArticleCategoryEnum.LIFESTYLE,
    name: 'Lifestyle & Culture'
  }
];
