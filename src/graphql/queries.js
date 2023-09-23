/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPullUpBar = /* GraphQL */ `
  query GetPullUpBar($id: ID!) {
    getPullUpBar(id: $id) {
      id
      name
      description
      userID
      location
      images
      Ratings {
        nextToken
        __typename
      }
      Comments {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPullUpBars = /* GraphQL */ `
  query ListPullUpBars(
    $filter: ModelPullUpBarFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPullUpBars(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        userID
        location
        images
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getRating = /* GraphQL */ `
  query GetRating($id: ID!) {
    getRating(id: $id) {
      id
      title
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listRatings = /* GraphQL */ `
  query ListRatings(
    $filter: ModelRatingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRatings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        pullupbarID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const ratingsByPullupbarID = /* GraphQL */ `
  query RatingsByPullupbarID(
    $pullupbarID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelRatingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ratingsByPullupbarID(
      pullupbarID: $pullupbarID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        pullupbarID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      content
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        content
        pullupbarID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const commentsByPullupbarID = /* GraphQL */ `
  query CommentsByPullupbarID(
    $pullupbarID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsByPullupbarID(
      pullupbarID: $pullupbarID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        content
        pullupbarID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
