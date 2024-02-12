import { Query, FilterQuery, Document } from 'mongoose';
import { ParsedQs } from 'qs';

interface QueryString {
	page?: string;
	sort?: string;
	limit?: string;
	fields?: string;
	[key: string]: string | undefined;
}

class QueryHandler<T extends Document> {
	private query: Query<T[], T>;
	private queryString: QueryString;
	private excludedFields: string[];

	constructor(
		query: Query<T[], T>,
		queryString: ParsedQs,
		excludedFields: string[] = ['page', 'sort', 'limit', 'fields']
	) {
		this.query = query;
		this.queryString = Object.fromEntries(Object.entries(queryString).map(([key, value]) => [key, String(value)]));
		this.excludedFields = excludedFields;
	}

	filter(): QueryHandler<T> {
		const queryObj: FilterQuery<T> = { ...(this.queryString as QueryString) };
		this.excludedFields.forEach((el) => delete queryObj[el]);

		this.query = this.query.find(queryObj);

		return this;
	}

	sort(defaultSort: string = '-createdAt'): QueryHandler<T> {
		const sortBy = this.queryString.sort ? this.queryString.sort.split(',').join(' ') : defaultSort;
		this.query = this.query.sort(sortBy);

		return this;
	}

	limitFields(defaultField: string = '-__v'): QueryHandler<T> {
		const fields = this.queryString.fields ? this.queryString.fields.split(',').join(' ') : defaultField;
		this.query = this.query.select(fields);

		return this;
	}

	paginate(defaultPage: number = 1, defaultLimit: number = 100): QueryHandler<T> {
		const page = parseInt(this.queryString.page || '') || defaultPage;
		const limit = parseInt(this.queryString.limit || '') || defaultLimit;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);

		return this;
	}

	async execute(): Promise<T[]> {
		return await this.query;
	}
}

export { QueryHandler };
