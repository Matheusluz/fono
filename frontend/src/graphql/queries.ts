// graphql/queries.ts
import { gql } from "@apollo/client";

export const GET_PATIENTS = gql`
  query GetPatients {
    patients {
      id
      firstName
      lastName
      email
      phone
      birthdate
      deletedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_PATIENT = gql`
  query GetPatient($id: ID!) {
    patient(id: $id) {
      id
      firstName
      lastName
      email
      phone
      birthdate
      deletedAt
    }
  }
`;
