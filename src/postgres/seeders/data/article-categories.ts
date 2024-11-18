import { faker } from '@faker-js/faker/locale/ar';
import { DeepPartial } from 'typeorm';
import { ArticleCategoryEntity } from '../../../article-category/entities/article-category.entity';
import { ArticleCategoryEnum } from '../../../common/enums/article-category.enum';

export const articleCategories: Omit<
  DeepPartial<ArticleCategoryEntity>,
  'createdAt' | 'updatedAt' | 'deletedAt'
>[] = [
  {
    id: faker.string.uuid(),
    type: ArticleCategoryEnum.TECHNOLOGY,
    name: 'Technology',
    articles: [],
  },
  {
    id: faker.string.uuid(),
    type: ArticleCategoryEnum.BUSINESS,
    name: 'Business',
    articles: [],
  },
  {
    id: faker.string.uuid(),
    type: ArticleCategoryEnum.LIFESTYLE,
    name: 'Lifestyle',
    articles: [],
  },
];
