import { SearchConditions } from '../search-conditions';

export interface GetPropertiesQuery {
  page?: string;
  pageSize?: string;
  searchTerm?: string;
  searchCondition?: SearchConditions;
}
