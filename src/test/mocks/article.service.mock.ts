import { ArticleEntity } from '../../article/entities/article.entity';

export const mockArticleService = {
  createArticle: jest.fn().mockImplementation((data, publisherId) => {
    const article = new ArticleEntity();
    Object.assign(article, {
      id: 'mock-article-id',
      ...data,
      publisherId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return Promise.resolve(article);
  }),

  findOneById: jest.fn().mockImplementation((id) => {
    const article = new ArticleEntity();
    Object.assign(article, {
      id,
      title: 'Test Article',
      description: 'Test Description',
      slug: 'test-article',
      content: { blocks: [] },
      publisherId: 'mock-publisher-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return Promise.resolve(article);
  }),

  getArticles: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      data: [],
      total: 0,
    });
  }),

  updateArticle: jest.fn().mockImplementation((id, data) => {
    const article = new ArticleEntity();
    Object.assign(article, {
      id,
      ...data,
      updatedAt: new Date(),
    });
    return Promise.resolve(article);
  }),

  publishArticle: jest.fn().mockImplementation((id) => {
    const article = new ArticleEntity();
    Object.assign(article, {
      id,
      publishedAt: new Date(),
    });
    return Promise.resolve(article);
  }),

  unpublishArticle: jest.fn().mockImplementation((id) => {
    const article = new ArticleEntity();
    Object.assign(article, {
      id,
      publishedAt: null,
    });
    return Promise.resolve(article);
  }),

  deleteArticle: jest.fn().mockImplementation((id) => {
    return Promise.resolve();
  }),
}; 