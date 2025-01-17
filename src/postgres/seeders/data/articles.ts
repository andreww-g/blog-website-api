import { faker } from '@faker-js/faker';
import * as _ from 'lodash';
import { DeepPartial } from 'typeorm';

import { ArticleEntity } from '../../../article/entities/article.entity';
import { articleCategories } from './article-categories';
import { publishers } from './publishers';

export const articles: Omit<DeepPartial<ArticleEntity>, 'createdAt' | 'updatedAt' | 'deletedAt'>[] = _.times(
  50,
  () => {
    const title = faker.lorem.sentence();
    const selectedCategory = _.sample(articleCategories);
    const selectedPublisher = _.sample(publishers);
    
    return {
      id: faker.string.uuid(),
      title,
      slug: faker.helpers.slugify(title.toLowerCase()),
      description: faker.lorem.paragraph(),
      image: {
        id: faker.string.uuid(),
        url: faker.image.urlLoremFlickr({ height: 600, width: 900, category: 'article' }),
        size: faker.number.float({ min: 100, max: 5000 }),
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
      categoryId: selectedCategory?.id,
      category: selectedCategory,
      publisherId: selectedPublisher?.id,
      publisher: selectedPublisher
    };
  },
);
