import { ArticlesService } from '../article/articles.service';
import { setupTestApp } from './setup/test-setup';
import { DeepPartial } from 'typeorm';
import { ArticleEntity } from '../article/entities/article.entity';
import { AuthService } from '../auth/auth.service';

describe('Articles', () => {
  let articleService: ArticlesService;
  let authService: AuthService;
  let createdArticleId: string;
  let publisherId: string = 'mock-publisher-id';

  const mockArticle: DeepPartial<ArticleEntity> = {
    title: 'Test Article',
    description: 'This is a test article description',
    slug: 'test-article',
    content: { blocks: [] },
  };

  beforeEach(async () => {
    const testSetup = await setupTestApp();
    articleService = testSetup.articleService;
    authService = testSetup.authService;
  });

  describe('Articles Management', () => {
    it('should create a new article', async () => {
      const result = await articleService.createArticle(mockArticle, publisherId);

      expect(result).toBeDefined();
      expect(result.title).toBe(mockArticle.title);
      expect(result.description).toBe(mockArticle.description);
      createdArticleId = result.id;
    });

    it('should get all articles with pagination', async () => {
      const result = await articleService.getArticles({
        onlyPublished: false,
      });

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(typeof result.total).toBe('number');
    });

    it('should get article by id', async () => {
      const result = await articleService.findOneById(createdArticleId, {
        onlyPublished: false,
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(createdArticleId);
    });

    it('should update article', async () => {
      const updateData = {
        title: 'Updated Test Article',
        description: 'Updated description',
      };

      const result = await articleService.updateArticle(createdArticleId, updateData);

      expect(result).toBeDefined();
      expect(result.title).toBe(updateData.title);
      expect(result.description).toBe(updateData.description);
    });

    it('should publish an article', async () => {
      const result = await articleService.publishArticle(createdArticleId);

      expect(result).toBeDefined();
      expect(result.publishedAt).toBeTruthy();
    });

    it('should unpublish an article', async () => {
      const result = await articleService.unpublishArticle(createdArticleId);

      expect(result).toBeDefined();
      expect(result.publishedAt).toBeNull();
    });
  });
});
