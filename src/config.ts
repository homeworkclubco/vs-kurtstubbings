export type Site = {
  website: string;
  author: string;
  seo: {
    title: string;
    description: string;
    image: string;
  };
  jsonld: {
    organization: {
      name: string;
      url: string;
      logo: string;
      sameAs: string[];
    };
    localBusiness: {
      name: string;
      address: {
        streetAddress: string;
        addressLocality: string;
        postalCode: string;
        addressCountry: string;
      };
      telephone: string;
    };
  };
};

export const SITE: Site = {
  website: "https://example.com",
  author: "Kurt Stubbings",
  seo: {
    title: "Kurt Stubbings - Astro Starter Template",
    description: "A flexible Astro starter template.",
    image: "https://example.com/og-image.png", // TODO: replace with actual default OG image
  },
  jsonld: {
    organization: {
      name: "Your Organisation",
      url: "https://example.com",
      logo: "https://example.com/logo.png", // TODO: replace with actual logo URL
      sameAs: [
        // TODO: add social profile URLs
      ],
    },
    localBusiness: {
      name: "Your Business",
      address: {
        streetAddress: "", // TODO: street address
        addressLocality: "", // TODO: city
        postalCode: "",      // TODO: postcode
        addressCountry: "GB",
      },
      telephone: "", // TODO: phone number
    },
  },
};
