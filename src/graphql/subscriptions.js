/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePullUpBar = /* GraphQL */ `
  subscription OnCreatePullUpBar(
    $filter: ModelSubscriptionPullUpBarFilterInput
  ) {
    onCreatePullUpBar(filter: $filter) {
      id
      name
      description
      userID
      location {
        lat
        lon
        __typename
      }
      images
      Ratings {
        nextToken
        __typename
      }
      Comments {
        nextToken
        __typename
      }
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdatePullUpBar = /* GraphQL */ `
  subscription OnUpdatePullUpBar(
    $filter: ModelSubscriptionPullUpBarFilterInput
  ) {
    onUpdatePullUpBar(filter: $filter) {
      id
      name
      description
      userID
      location {
        lat
        lon
        __typename
      }
      images
      Ratings {
        nextToken
        __typename
      }
      Comments {
        nextToken
        __typename
      }
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeletePullUpBar = /* GraphQL */ `
  subscription OnDeletePullUpBar(
    $filter: ModelSubscriptionPullUpBarFilterInput
  ) {
    onDeletePullUpBar(filter: $filter) {
      id
      name
      description
      userID
      location {
        lat
        lon
        __typename
      }
      images
      Ratings {
        nextToken
        __typename
      }
      Comments {
        nextToken
        __typename
      }
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateRating = /* GraphQL */ `
  subscription OnCreateRating($filter: ModelSubscriptionRatingFilterInput) {
    onCreateRating(filter: $filter) {
      id
      title
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateRating = /* GraphQL */ `
  subscription OnUpdateRating($filter: ModelSubscriptionRatingFilterInput) {
    onUpdateRating(filter: $filter) {
      id
      title
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteRating = /* GraphQL */ `
  subscription OnDeleteRating($filter: ModelSubscriptionRatingFilterInput) {
    onDeleteRating(filter: $filter) {
      id
      title
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($filter: ModelSubscriptionCommentFilterInput) {
    onCreateComment(filter: $filter) {
      id
      content
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($filter: ModelSubscriptionCommentFilterInput) {
    onUpdateComment(filter: $filter) {
      id
      content
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($filter: ModelSubscriptionCommentFilterInput) {
    onDeleteComment(filter: $filter) {
      id
      content
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
