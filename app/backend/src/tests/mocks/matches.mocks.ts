const matchesMock = [
  {
    id: 1,
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
    awayTeamGoals: 1,
    inProgress: false,
  },
  {
    id: 2,
    homeTeamId: 9,
    homeTeamGoals: 1,
    awayTeamId: 14,
    awayTeamGoals: 1,
    inProgress: true,
  },
];

const inProgressMatchesMock = [
  {
    id: 2,
    homeTeamId: 9,
    homeTeamGoals: 1,
    awayTeamId: 14,
    awayTeamGoals: 1,
    inProgress: true,
  },
];

const NaNGoalsFields = [
  { homeTeamGoals: 1, awayTeamGoals: 'a' },
  { homeTeamGoals: 'a', awayTeamGoals: 1 },
];

const negativeGoalsFields = [
  { homeTeamGoals: -1, awayTeamGoals: 1 },
  { homeTeamGoals: 1, awayTeamGoals: -1 },
];

const missingCreateMatchFields = [
  { homeTeamId: 1 },
  { awayTeamId: 1 },
  { homeTeamId: 1, awayTeamId: 2 },
  { homeTeamId: 1, awayTeamId: 2, homeTeamGoals: 1 },
  { homeTeamId: 1, awayTeamId: 2, awayTeamGoals: 1 },
  { awayTeamId: 1, homeTeamGoals: 1, awayTeamGoals: 1 },
  { homeTeamId: 1, homeTeamGoals: 1, awayTeamGoals: 1 },
];

export { matchesMock, NaNGoalsFields, negativeGoalsFields, inProgressMatchesMock, missingCreateMatchFields };
