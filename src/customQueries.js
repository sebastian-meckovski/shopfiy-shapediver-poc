/* eslint-disable */

export const listPullUpBarsByUser = (id) => {
  return /* GraphQL */ `
    query MyQuery {
    listPullUpBars(
        filter: { userID: { eq: "${id}" } }
    ) {
        items {
        id
        location
        name
        userID
        description
        }
    }
    }
`;
};
