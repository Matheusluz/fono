// graphql/mutations.ts
import { gql } from "@apollo/client";

export const CREATE_PATIENT = gql`
  mutation CreatePatient($firstName: String!, $lastName: String!, $email: String, $phone: String, $birthdate: ISO8601Date) {
    createPatient(firstName: $firstName, lastName: $lastName, email: $email, phone: $phone, birthdate: $birthdate) {
      patient { id firstName lastName email phone birthdate deletedAt }
      errors
    }
  }
`;

export const UPDATE_PATIENT = gql`
  mutation UpdatePatient($id: ID!, $firstName: String, $lastName: String, $email: String, $phone: String, $birthdate: ISO8601Date) {
    updatePatient(id: $id, firstName: $firstName, lastName: $lastName, email: $email, phone: $phone, birthdate: $birthdate) {
      patient { id firstName lastName email phone birthdate deletedAt }
      errors
    }
  }
`;

export const DELETE_PATIENT = gql`
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id) {
      success
      errors
    }
  }
`;

export const RESTORE_PATIENT = gql`
  mutation RestorePatient($id: ID!) {
    restorePatient(id: $id) {
      patient { id firstName lastName email phone birthdate deletedAt }
      errors
    }
  }
`;
