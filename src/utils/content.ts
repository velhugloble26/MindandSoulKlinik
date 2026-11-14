// Supplied homepage copy. Later phases move editable content into MongoDB.
export const SERVICES = [
  {
    id: "individual-counselling",
    title: "Individual Counselling",
    tone: "therapy",
    description:
      "Individual therapy provides an opportunity for personal development and emotional support in a safe, comfortable and confidential environment.",
    points: [
      "Anger management",
      "Depression",
      "Anxiety",
      "Substance misuse",
      "Marital and relationship difficulties",
      "Parenting challenges",
      "Academic struggles",
      "Career changes",
    ],
  },
  {
    id: "career-counselling",
    title: "Career Assessment & Counselling",
    tone: "assessment",
    description:
      "Help individuals navigate their professional journeys with confidence and clarity.",
    points: [
      "Career assessment",
      "Career exploration",
      "Career goal setting",
      "Resume guidance",
      "Interview preparation",
      "Career transition support",
      "Work-life balance",
      "Personalized guidance",
    ],
  },
  {
    id: "family-counselling",
    title: "Family Counselling",
    tone: "psychiatry",
    description:
      "Family counselling helps improve communication, repair relationships and develop coping mechanisms.",
    points: [
      "Relationship improvement",
      "Family communication",
      "Stress management",
      "Coping mechanisms",
      "Family challenges",
      "Support for difficult life changes",
    ],
  },
  {
    id: "relationship-building",
    title: "Relationship Building",
    tone: "therapy",
    description:
      "Every relationship experiences ups and downs. Professional counselling can help couples strengthen their partnership, improve communication and work through relationship difficulties.",
    points: [
      "Trust issues",
      "Communication difficulties",
      "Frequent arguments",
      "Conflict resolution",
      "Emotional intimacy",
      "Relationship rebuilding",
    ],
  },
] as const;
