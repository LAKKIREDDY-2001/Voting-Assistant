export interface ElectionPhase {
  id: string;
  title: string;
  description: string;
  steps: string[];
  duration: string;
  icon: string;
}

export const ELECTION_PHASES: ElectionPhase[] = [
  {
    id: "registration",
    title: "Voter Registration (EPIC)",
    description: "Ensuring your name is in the Electoral Roll. You need to apply using Form 6 via NVSP.",
    steps: [
      "Check eligibility (18+ years, Indian citizen).",
      "Visit NVSP.in or use the Voter Helpline App.",
      "Fill Form 6 for new registration or Form 8 for shifts.",
      "Track application status and receive your EPIC card."
    ],
    duration: "Ongoing (NVSP Portal)",
    icon: "UserPlus"
  },
  {
    id: "verification",
    title: "Electoral Roll Verification",
    description: "Confirming your presence in the final list before elections.",
    steps: [
      "Search your name on the ECI Electoral Search portal.",
      "Verify your details (Name, Father's Name, Age).",
      "Check for BLO (Booth Level Officer) verification.",
      "Locate your designated Polling Station."
    ],
    duration: "Ongoing",
    icon: "Search"
  },
  {
    id: "campaign",
    title: "Campaign & Manifesto",
    description: "Political parties announce their candidates and release their manifestos.",
    steps: [
      "Analyze party manifestos and candidate profiles.",
      "Monitor the Model Code of Conduct (MCC) enforcement.",
      "Attend public rallies or watch debates.",
      "Understand the key issues in your constituency."
    ],
    duration: "4-6 weeks before voting",
    icon: "Megaphone"
  },
  {
    id: "polling",
    title: "Polling Day",
    description: "The day you cast your vote using EVMs and VVPATs.",
    steps: [
      "Carry your EPIC card or alternative ID (Aadhaar, etc.).",
      "Get marked with indelible ink on your finger.",
      "Cast your vote on the EVM (Electronic Voting Machine).",
      "Verify the slip on the VVPAT (Paper Audit Trail)."
    ],
    duration: "Consolidated Phases",
    icon: "Vote"
  },
  {
    id: "results",
    title: "Counting & Results",
    description: "The official counting of votes and declaration of winning candidates.",
    steps: [
      "ECI begins counting at various centers.",
      "Real-time results shared on results.eci.gov.in.",
      "Winning candidates receive election certificates.",
      "Formation of the new government begins."
    ],
    duration: "Result Day",
    icon: "ShieldCheck"
  }
];
