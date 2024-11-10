import { DataSource, QueryRunner } from 'typeorm';


export const wrapWithTransaction = async (
  dataSource: DataSource,
  fn: (queryRunner: QueryRunner) => Promise<void>,
) => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await fn(queryRunner);
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};
