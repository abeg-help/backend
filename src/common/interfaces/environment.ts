export interface IEnvironment {
	APP: {
		NAME?: string;
		PORT: number;
		ENV?: string;
		CLIENT: string;
	};
	DB: {
		URL: string;
	};
	REDIS: {
		URL: string;
		PORT: number;
		PASSWORD: string;
	};
	CACHE_REDIS: {
		URL: string;
	};
	EMAIL: {
		API_KEY: string;
	};
	JWT: {
		ACCESS_KEY: string;
		REFRESH_KEY: string;
	};
	JWT_EXPIRES_IN: {
		ACCESS: string;
		REFRESH: string;
	};
	FRONTEND_URL: string;
	AWS: {
		ACCESS_KEY_ID: string;
		SECRET_ACCESS_KEY: string;
		REGION: string;
		BUCKET_NAME: string;
		CLOUD_FRONT_URL: string;
	};
}
