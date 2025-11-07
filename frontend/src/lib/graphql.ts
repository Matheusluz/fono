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

export const USERS_QUERY = gql`
  query Users {
    users {
      id
      email
      admin
    }
  }
`

export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($email: String!, $password: String!, $passwordConfirmation: String!) {
    registerUser(email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
      user {
        id
        email
        admin
      }
      errors
    }
  }
`

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $email: String, $password: String, $passwordConfirmation: String, $admin: Boolean) {
    updateUser(id: $id, email: $email, password: $password, passwordConfirmation: $passwordConfirmation, admin: $admin) {
      user {
        id
        email
        admin
      }
      errors
    }
  }
`

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      errors
    }
  }
`

// ==================== PATIENTS ====================

export const PATIENTS_QUERY = gql`
  query Patients {
    patients {
      id
      firstName
      lastName
      birthdate
      email
      phone
    }
  }
`

export const PATIENT_QUERY = gql`
  query Patient($id: ID!) {
    patient(id: $id) {
      id
      firstName
      lastName
      birthdate
      email
      phone
    }
  }
`

export const CREATE_PATIENT_MUTATION = gql`
  mutation CreatePatient($firstName: String!, $lastName: String!, $birthdate: ISO8601Date, $email: String, $phone: String) {
    createPatient(firstName: $firstName, lastName: $lastName, birthdate: $birthdate, email: $email, phone: $phone) {
      patient {
        id
        firstName
        lastName
        birthdate
        email
        phone
      }
      errors
    }
  }
`

export const UPDATE_PATIENT_MUTATION = gql`
  mutation UpdatePatient($id: ID!, $firstName: String, $lastName: String, $birthdate: ISO8601Date, $email: String, $phone: String) {
    updatePatient(id: $id, firstName: $firstName, lastName: $lastName, birthdate: $birthdate, email: $email, phone: $phone) {
      patient {
        id
        firstName
        lastName
        birthdate
        email
        phone
      }
      errors
    }
  }
`

export const DELETE_PATIENT_MUTATION = gql`
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id) {
      success
      errors
    }
  }
`
