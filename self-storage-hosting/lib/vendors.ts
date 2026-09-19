// Where each vendor's own support lives (Appendix A.2), checked by hand on
// verifiedOn. Links only: the vendors' own pages disagree about phone
// numbers, so none are published. Rendered by /support.
export type Vendor = {
  company: string;
  products: string;
  url: string;
  verifiedOn: string;
};

export const VENDORS: Vendor[] = [
  {
    company: "PTI Security Systems",
    products: "StorLogix, StorLogix Cloud, FalconXT and CloudController",
    url: "https://www.ptisecurity.com/us/en/get_support",
    verifiedOn: "2026-09-18",
  },
  {
    company: "OpenTech Alliance",
    products: "INSOMNIAC® CIA",
    url: "https://opentechalliance.com/support/",
    verifiedOn: "2026-09-18",
  },
  {
    company: "Storable",
    products: "Sitelink by Storable",
    url: "https://support.sitelink.com/",
    verifiedOn: "2026-09-18",
  },
  {
    company: "Storable",
    products: "Storable Edge",
    url: "https://help.storedge.com/",
    verifiedOn: "2026-09-18",
  },
  {
    company: "Storable",
    products: "Storable Easy",
    url: "https://www.storageunitsoftware.com/support/",
    verifiedOn: "2026-09-18",
  },
  {
    company: "Storable",
    products: "Any other Storable product",
    url: "https://www.storable.com/support/",
    verifiedOn: "2026-09-18",
  },
  {
    company: "Janus International",
    products: "Nokē Smart Entry",
    url: "https://www.janusintl.com/knowledge",
    verifiedOn: "2026-09-18",
  },
  {
    company: "DoorKing",
    products: "DKS products",
    url: "https://www.doorking.com/tech-support/",
    verifiedOn: "2026-09-18",
  },
];
