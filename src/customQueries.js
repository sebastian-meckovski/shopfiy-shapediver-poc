/* eslint-disable */

export const listPullUpBarsByUserQuery = /* GraphQL */ `
  query listPullUpBarsByUser($userID: String) {
    listPullUpBars(filter: { userID: { eq: $userID } }) {
      items {
        id
        location
        name
        userID
        description
        images
      }
    }
  }
`;

export const listPullUpBarsByUserByDate = /* GraphQL */ `
  query PullUpBarsByDate($userID: String) {
    PullUpBarsByDate(
      type: "PullUpBar"
      sortDirection: DESC
      filter: { userID: { eq: $userID } }
    ) {
      items {
        id
        images
        name
        description
        userID
      }
    }
  }
`;
export const listPullUpBarsCoords = /* GraphQL */ `
  query MyQuery {
    listPullUpBars {
      items {
        location {
          lat
          lon
        }
        id
      }
    }
  }
`;
