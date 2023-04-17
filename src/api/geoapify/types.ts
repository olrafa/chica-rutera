// The types from the Geoapify responses.

// IP Info
// Not really all there is to it but what we're using so far
export type IpInfoResponse = {
  location: {
    latitude: number;
    longitude: number;
  };
};

// Parameters to form the address search request.
export type AddressSearchParams = {
  address: string;
  lon?: number;
  lat?: number;
};

// Address search result. Again, not really all there is to it but what we're using so far
export type AddressResult = {
  formatted: string;
  lon: number;
  lat: number;
  city: string;
  country: string;
};

type AddressFeature = {
  type: string;
  bbox: number[];
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: AddressResult;
};

export type AddressResponse = {
  type: string;
  features: AddressFeature[];
  query: {
    text: string;
    parsed: {
      housenumber: string;
      street: string;
      expected_type: string;
    };
  };
};
