import { gql } from '@apollo/client'

export const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user { id email admin }
      token
      errors
    }
  }
`

export const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser { id email admin }
  }
`
