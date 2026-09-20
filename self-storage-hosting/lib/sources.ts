// Third-party documents this site cites, each checked by hand on the date
// given. Pages link these instead of restating vendor claims from memory.
// When a URL moves or its content changes, fix it here, re-check every page
// that cites it, and update verifiedOn.
export type Source = { url: string; title: string; publisher: string; verifiedOn: string };

export const SOURCES = {
  storableEasyDigiGate: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/digi-gate-integration~7609004328930853160",
    title: "DigiGate integration guide",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEasyGateSync: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-troubleshooting/what-should-i-do-if-the-gate-sync-is-not-working~7609015167005715714",
    title: "What to do if the gate sync is not working",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  digiGateManual: {
    url: "https://www.ptisecurity.com/documents/access-control/controllers/controllers-archive/digigate-archive/DigiGate_Install_Manual_1100_044___Ver2.5__.pdf",
    title: "DigiGate installation manual, archived (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiFacts: {
    url: "https://www.ptisecurity.com/us/en/facts",
    title: "Facts, including legacy products",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiContinuousLearning: {
    url: "https://www.ptisecurity.com/us/en/get_support/continuous-learning",
    title: "Continuous learning",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiMigrationManual: {
    url: "https://www.ptisecurity.com/documents/access-control/controllers/controllers-current/FalconXT%20to%20CloudController%20Migration.pdf",
    title: "FalconXT to CloudController migration manual (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },

  // Cited by the /resources articles. Titles are written in our words wherever
  // a document's own title uses a spelling the content policy forbids.
  ptiLlmsTxt: {
    url: "https://www.ptisecurity.com/LLMs.txt",
    title: "Canonical facts for AI systems (plain text)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiCloudControllerManual: {
    url: "https://www.ptisecurity.com/documents/access-control/controllers/controllers-current/cloud-controller-user-manual-91924.pdf",
    title: "CloudController user's manual (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiNextGenBlog: {
    url: "https://www.ptisecurity.com/us/en/about-us/articles-and-news/blogs/four-ways-the-next-gen-cloud-controller-improves-self-storage-security",
    title: "Four ways the next-gen Cloud Controller improves self-storage security",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiComparisonChart: {
    url: "https://www.ptisecurity.com/documents/access-control/controllers/controllers-current/controller-comparison-chart.pdf",
    title: "Controller comparison chart (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiCloudFalconGuide: {
    url: "https://www.ptisecurity.com/documents/access-control/storlogix-cloud/storlogix-cloud-archive/StorLogix%20CLoud%20and%20FalconXT%20User%20Guide.pdf",
    title: "StorLogix Cloud and FalconXT user guide, archived (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiDesktopRequirements: {
    url: "https://www.ptisecurity.com/documents/misc/misc-archive/Computer_System_Requirements___StorLogix_Desktop.pdf",
    title: "Computer requirements for StorLogix Desktop, archived (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiDesktopToCloudBlog: {
    url: "https://www.ptisecurity.com/us/en/about-us/articles-and-news/blogs/moving-from-desktop-to-cloud",
    title: "Moving from desktop to cloud",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  storableAccessControl: {
    url: "https://www.storable.com/products/access-control/",
    title: "Storable Access Control",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },

  opentechCia: {
    url: "https://opentechalliance.com/solutions/insomniac-cia-access-control/",
    title: "CIA access control",
    publisher: "OpenTech Alliance",
    verifiedOn: "2026-09-19",
  },
  opentechPtiKeypads: {
    url: "https://opentechalliance.com/blog/opentech-releases-pti-keypad-integration/",
    title: "OpenTech releases PTI keypad integration (2020)",
    publisher: "OpenTech Alliance",
    verifiedOn: "2026-09-19",
  },

  doorkingSelfStorage: {
    url: "https://www.doorking.com/consumers/self-storage/",
    title: "Self storage",
    publisher: "DoorKing",
    verifiedOn: "2026-09-19",
  },
  janusNoke: {
    url: "https://www.janusintl.com/products/noke",
    title: "Nokē Smart Entry product page",
    publisher: "Janus International",
    verifiedOn: "2026-09-19",
  },
  janusFaq: {
    url: "https://www.janusintl.com/access-control/faqs",
    title: "Access control FAQs",
    publisher: "Janus International",
    verifiedOn: "2026-09-19",
  },

  storguardProducts: {
    url: "https://stor-guard.com/products/",
    title: "Products",
    publisher: "StorGuard",
    verifiedOn: "2026-09-19",
  },
  sentinelHardware: {
    url: "https://www.sentinelsystems.com/hardware",
    title: "Access control hardware",
    publisher: "Sentinel Systems",
    verifiedOn: "2026-09-19",
  },
  spiderdoorHome: {
    url: "https://www.spiderdoor.com/",
    title: "Self-storage gate security",
    publisher: "SpiderDoor",
    verifiedOn: "2026-09-19",
  },
  spiderdoorSwitch: {
    url: "https://www.spiderdoor.com/switch-self-storage-access-control-system/",
    title: "Switching access control systems without downtime",
    publisher: "SpiderDoor",
    verifiedOn: "2026-09-19",
  },
  quikstorHome: {
    url: "https://quikstor.com/",
    title: "Self-storage management software",
    publisher: "QuikStor",
    verifiedOn: "2026-09-19",
  },
} satisfies Record<string, Source>;
