/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const sendChallengeResults = /* GraphQL */ `
  mutation SendChallengeResults($id: String!, $results: [Int]) {
    sendChallengeResults(id: $id, results: $results) {
      multiply
      errors
      duration
      when
      pb
    }
  }
`;
export const resetScores = /* GraphQL */ `
  mutation ResetScores {
    resetScores {
      multiply
      errors
      duration
      when
      pb
    }
  }
`;
