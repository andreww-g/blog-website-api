import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';


export class SnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  tableName (className: string, customName: string): string {
    return customName
      ? customName
      : snakeCase(className.replace(/Entity$/, ''));
  }

  columnName (
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return (
      snakeCase([...embeddedPrefixes, ''].join('_')) +
      (customName ? customName : snakeCase(propertyName))
    );
  }

  relationName (propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName (relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + '_' + referencedColumnName);
  }

  joinTableName (
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
  ): string {
    return snakeCase(
      firstTableName +
      '_' +
      firstPropertyName.replace(/\./gi, '_') +
      '_' +
      secondTableName,
    );
  }

  joinTableColumnName (
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(
      tableName + '_' + (columnName ? columnName : propertyName),
    );
  }

  classTableInheritanceParentColumnName (
    parentTableName: string,
    parentTableIdPropertyName: string,
  ): string {
    return snakeCase(parentTableName + '_' + parentTableIdPropertyName);
  }

  eagerJoinRelationAlias (alias: string, propertyPath: string): string {
    return alias + '__' + propertyPath.replace('.', '_');
  }

  primaryKeyName (tableOrName: Table | string, columnNames: string[]) {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;

    return `${ snakeCase(table) }__${ snakeCase(columnNames.join('_')) }__p_key`.toLowerCase();
  }

  foreignKeyName (tableOrName: Table | string, columnNames: string[]) {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;

    return `${ snakeCase(table) }__${ snakeCase(columnNames.join('_')) }__f_key`.toLowerCase();
  }

  indexName (tableOrName: Table | string, columnNames: string[]): string {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;

    return `${ snakeCase(table) }__${ snakeCase(columnNames.join('_')) }__idx`.toLowerCase();
  }

  uniqueConstraintName (tableOrName: Table | string, columnNames: string[]): string {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;

    return `${ snakeCase(table) }__${ snakeCase(columnNames.join('_')) }__key`.toLowerCase();
  }

  checkConstraintName (tableOrName: Table | string, expression: string): string {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;

    return `${ snakeCase(table) }__${ snakeCase(expression) }__check`.toLowerCase();
  }

  exclusionConstraintName (tableOrName: Table | string, expression: string): string {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;

    return `${ snakeCase(table) }__${ snakeCase(expression) }__excl`.toLowerCase();
  }

  defaultConstraintName (tableOrName: Table | string, columnName: string): string {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;

    return `${ snakeCase(table) }__${ snakeCase(columnName) }_default`.toLowerCase();
  }
}
