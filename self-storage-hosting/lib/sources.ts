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
  ptiCloudManual: {
    url: "https://www.ptisecurity.com/documents/access-control/storlogix-cloud/storlogix-cloud-current/storlogix-user-manual_071423-1.pdf",
    title: "StorLogix Cloud user's manual (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiKeypadMessages: {
    url: "https://www.ptisecurity.com/documents/keypads/keypads-general/troubleshooting_keypad_messages.pdf",
    title: "Troubleshooting keypad messages (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiCloudAdapterGuide: {
    url: "https://www.ptisecurity.com/documents/litmos-docs/storlogix-cloud/StorLogix%20Cloud%20Adapter%20Installation%20Guide.pdf",
    title: "Cloud Adapter installation guide (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  storableEasyCommonProblems: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-troubleshooting/common-gate-problems~7609015150086836225",
    title: "Common gate problems (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEasyDoorKing: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/doorking-gate-integration-and-troubleshooting~7609004327770822699",
    title: "DoorKing gate integration and troubleshooting (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEasyStorLogix: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/pti-storlogix-gate-integration~7609004327358414196",
    title: "PTI StorLogix gate integration (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEasyNoke: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/janus-noke-smart-entry-system~7609004324182144375",
    title: "Nokē Smart Entry integration (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEasyCloudNode: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-troubleshooting/what-should-i-do-if-i-get-an-error-that-there-was-a-problem-communicating-with-the-cloud-node~7609015147653595240",
    title: "Error communicating with the cloud node (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableAccessControlFaq: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/storable-access-control/storable-access-control-faq~7609022205225526581",
    title: "Storable Access Control FAQ (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableAccessControl: {
    url: "https://www.storable.com/products/access-control/",
    title: "Storable Access Control",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEdgeGateIntegration: {
    url: "https://help.storedge.com/storable-edge/account-management/facility-level-software-settings/gate-integration~7616843970740718814",
    title: "Gate integration (Storable Edge help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEdgeDelinquency: {
    url: "https://help.storedge.com/storable-edge/account-management/delinquency-settings/delinquency-stages~7616206212725672475",
    title: "Delinquency stages (Storable Edge help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEdgeGateReport: {
    url: "https://help.storedge.com/storable-edge/edge-product-guides/facility-level-reports/gate-access-report~7618986903542044427",
    title: "Gate access report (Storable Edge help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  sitelinkGateNotUpdating: {
    url: "https://support.sitelink.com/sitelink/sitelink-product-guides/access-and-gates/third-party-gates/troubleshooting-gate-is-not-updating~7605336808232776280",
    title: "Troubleshooting a gate that is not updating (Sitelink help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  sitelinkLockoutPrereq: {
    url: "https://support.sitelink.com/sitelink/sitelink-product-guides/access-and-gates/third-party-gates/how-do-i-set-prerequisite-events-for-gate-lockout~7605339858688561093",
    title: "Prerequisite events for gate lockout (Sitelink help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  sitelinkGateReport: {
    url: "https://support.sitelink.com/sitelink/sitelink-product-guides/reporting/the-gate-access-report~7607938886650522488",
    title: "The gate access report (Sitelink help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  sitelinkWithholdCodes: {
    url: "https://support.sitelink.com/sitelink/sitelink-product-guides/online-move-ins/how-do-i-withhold-gate-codes-for-online-move-ins~7605341655154753291",
    title: "Withholding gate codes for online move-ins (Sitelink help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },

  opentechCia: {
    url: "https://opentechalliance.com/solutions/insomniac-cia-access-control/",
    title: "CIA access control",
    publisher: "OpenTech Alliance",
    verifiedOn: "2026-09-19",
  },
  opentechG600Guide: {
    url: "https://opentechalliance.com/wp-content/uploads/2026/07/INSOMNIAC-CIA-G-600-Gateway-Installation-Guide.pdf",
    title: "CIA G-600 gateway installation guide (PDF)",
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
  doorkingRamManual: {
    url: "https://www.doorking.com/wp-content/uploads/2013/09/1835-066-K-4-10_V6-2c.pdf",
    title: "Remote Account Manager for Windows user's manual (PDF)",
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
  janusAppTroubleshooting: {
    url: "https://www.janusintl.com/knowledge/basic-app-device-troubleshooting",
    title: "Troubleshooting tips for the mobile app",
    publisher: "Janus International",
    verifiedOn: "2026-09-19",
  },
  janusNokeTraining: {
    url: "https://www.janusintl.com/knowledge/nok%C4%93-smart-entry-training-manual",
    title: "Nokē Smart Entry training manual",
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
