export interface IEnvironment {
	APP: {
		NAME?: string;
		PORT: string | number;
		ENV?: string;
	};
	DB: {
		URL: string;
	};
}
