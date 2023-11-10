export interface IEnvironment {
	APP: {
		NAME?: string;
		PORT: string | number;
		ENV?: string;
	};
	DB: {
		URL: string;
	};
	REDIS: {
		URL: string;
		PORT: number;
		PASSWORD: string;
	};
	EMAIL: {
		API_KEY: string;
	};
	ACCESS: {
		SECRET: string;
	};
	REFRESH: {
		SECRET: string;
	};
}
