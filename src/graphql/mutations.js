/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPullUpBar = /* GraphQL */ `
  mutation CreatePullUpBar(
    $input: CreatePullUpBarInput!
    $condition: ModelPullUpBarConditionInput
  ) {
    createPullUpBar(input: $input, condition: $condition) {
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
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updatePullUpBar = /* GraphQL */ `
  mutation UpdatePullUpBar(
    $input: UpdatePullUpBarInput!
    $condition: ModelPullUpBarConditionInput
  ) {
    updatePullUpBar(input: $input, condition: $condition) {
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
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePullUpBar = /* GraphQL */ `
  mutation DeletePullUpBar(
    $input: DeletePullUpBarInput!
    $condition: ModelPullUpBarConditionInput
  ) {
    deletePullUpBar(input: $input, condition: $condition) {
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
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createRating = /* GraphQL */ `
  mutation CreateRating(
    $input: CreateRatingInput!
    $condition: ModelRatingConditionInput
  ) {
    createRating(input: $input, condition: $condition) {
      id
      title
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateRating = /* GraphQL */ `
  mutation UpdateRating(
    $input: UpdateRatingInput!
    $condition: ModelRatingConditionInput
  ) {
    updateRating(input: $input, condition: $condition) {
      id
      title
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteRating = /* GraphQL */ `
  mutation DeleteRating(
    $input: DeleteRatingInput!
    $condition: ModelRatingConditionInput
  ) {
    deleteRating(input: $input, condition: $condition) {
      id
      title
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      content
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
      id
      content
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
      id
      content
      pullupbarID
      createdAt
      updatedAt
      __typename
    }
  }
`;
