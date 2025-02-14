/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getZellerCustomer = /* GraphQL */ `
  query GetZellerCustomer($id: String!) {
    getZellerCustomer(id: $id) {
      id
      name
      email
      role
      __typename
    }
  }
`;
export const listZellerCustomers = /* GraphQL */ `
  query ListZellerCustomers(
    $filter: TableZellerCustomerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listZellerCustomers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        role
        __typename
      }
      nextToken
      __typename
    }
  }
`;
