import { faker } from '@faker-js/faker/locale/ar';
import { DeepPartial } from 'typeorm';
import { ArticleEntity } from '../../../article/entities/article.entity';
import { articleCategories } from './article-categories';

export const articles: Omit<
  DeepPartial<ArticleEntity>,
  'createdAt' | 'updatedAt' | 'deletedAt'
>[] = [
  {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    slug: faker.helpers.slugify(faker.lorem.sentence().toLowerCase()),
    description: faker.lorem.paragraph(),
    image: {
      id: faker.string.uuid(),
      url: faker.image.url(),
      size: faker.number.float(),
      name: faker.string.alpha({ casing: 'lower', length: 10 }),
    },
    content: {
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: faker.lorem.paragraphs(3),
          },
        },
      ],
    },
    publishedAt: faker.date.past(),
    categoryId: articleCategories[0].id,
    category: articleCategories[0],
  },
  {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    slug: faker.helpers.slugify(faker.lorem.sentence().toLowerCase()),
    description: faker.lorem.paragraph(),
    image: {
      id: faker.string.uuid(),
      url: faker.image.url(),
      size: faker.number.float(),
      name: faker.string.alpha({ casing: 'lower', length: 10 }),
    },
    content: {
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: faker.lorem.paragraphs(3),
          },
        },
      ],
    },
    publishedAt: faker.date.past(),
    categoryId: articleCategories[1].id,
    category: articleCategories[1],
  },
];
