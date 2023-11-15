export interface IEnvironment {
	APP: {
		NAME?: string;
		PORT: number;
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
	JWT: {
		ACCESS_KEY: string;
		REFRESH_KEY: string;
	};
}
