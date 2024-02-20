export interface ILocation {
	country: string;
	city: string;
	postalCode: string;
	ipv4: string;
	ipv6: string;
	geo: {
		lat: string;
		lng: string;
	};
	region: string;
	continent: string;
	timezone: string;
	os: string;
	createdAt: Date;
	updatedAt: Date;
	user: {
		type: string;
		ref: string;
	};
}

export type locationModel = ILocation;
