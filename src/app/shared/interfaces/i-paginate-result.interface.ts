export interface IPaginatedInterface<T> {
  docs: Array<T>;
  total: number;
  limit: number;
  page?: number;
  pages?: number;
  offset?: number;
}
