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
} satisfies Record<string, Source>;
