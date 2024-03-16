type PaginatedResponseArgs<T> = {
  data: Array<T>;
  totalCount: number;
  page: number;
  limit: number;
  ignoreLimit?: boolean;
};

export class PaginatedResponse<T> {
  // private links: any = {};
  public data: Array<T>;
  public page: number;
  public limit: number;
  public pageCount: number;
  public totalCount: number;

  constructor({
    data,
    totalCount,
    page = 1,
    limit,
    ignoreLimit,
  }: PaginatedResponseArgs<T>) {
    limit = ignoreLimit ? totalCount : limit ?? 10;
    this.data = data;
    this.page = page;
    this.limit = limit;
    this.pageCount = Math.ceil(totalCount / limit);
    this.totalCount = totalCount;
  }
}
