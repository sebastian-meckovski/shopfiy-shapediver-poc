/* eslint-disable */

export const listPullUpBarsByUser = (id) => {
  return /* GraphQL */ `
    query listPullUpBarsByUser {
    listPullUpBars(
        filter: { userID: { eq: "${id}" } }
    ) {
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
};
