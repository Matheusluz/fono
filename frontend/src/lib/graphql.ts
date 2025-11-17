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

// ==================== PROFESSIONALS ====================

export const PROFESSIONALS_QUERY = gql`
  query Professionals($includeInactive: Boolean) {
    professionals(includeInactive: $includeInactive) {
      id
      userId
      email
      fullName
      specialtyId
      specialtyName
      specialty {
        id
        name
      }
      councilRegistration
      bio
      active
      createdAt
    }
  }
`

export const PROFESSIONAL_QUERY = gql`
  query Professional($id: ID!) {
    professional(id: $id) {
      id
      userId
      email
      fullName
      specialtyId
      specialtyName
      specialty {
        id
        name
      }
      councilRegistration
      bio
      active
      user {
        id
        email
        role
      }
    }
  }
`

export const CREATE_PROFESSIONAL_MUTATION = gql`
  mutation CreateProfessional($userId: ID!, $specialtyId: ID!, $councilRegistration: String, $bio: String) {
    createProfessional(userId: $userId, specialtyId: $specialtyId, councilRegistration: $councilRegistration, bio: $bio) {
      professional {
        id
        userId
        email
        specialtyId
        specialtyName
        councilRegistration
        bio
        active
      }
      errors
    }
  }
`

export const UPDATE_PROFESSIONAL_MUTATION = gql`
  mutation UpdateProfessional($id: ID!, $specialtyId: ID, $councilRegistration: String, $bio: String, $active: Boolean) {
    updateProfessional(id: $id, specialtyId: $specialtyId, councilRegistration: $councilRegistration, bio: $bio, active: $active) {
      professional {
        id
        userId
        email
        specialtyId
        specialtyName
        councilRegistration
        bio
        active
      }
      errors
    }
  }
`

export const DELETE_PROFESSIONAL_MUTATION = gql`
  mutation DeleteProfessional($id: ID!) {
    deleteProfessional(id: $id) {
      success
      errors
    }
  }
`

// ==================== SPECIALTIES ====================

export const SPECIALTIES_QUERY = gql`
  query Specialties($includeInactive: Boolean) {
    specialties(includeInactive: $includeInactive) {
      id
      name
      description
      active
      professionalsCount
      createdAt
      updatedAt
    }
  }
`

export const SPECIALTY_QUERY = gql`
  query Specialty($id: ID!) {
    specialty(id: $id) {
      id
      name
      description
      active
      professionalsCount
    }
  }
`

export const CREATE_SPECIALTY_MUTATION = gql`
  mutation CreateSpecialty($name: String!, $description: String) {
    createSpecialty(name: $name, description: $description) {
      specialty {
        id
        name
        description
        active
      }
      errors
    }
  }
`

export const UPDATE_SPECIALTY_MUTATION = gql`
  mutation UpdateSpecialty($id: ID!, $name: String, $description: String, $active: Boolean) {
    updateSpecialty(id: $id, name: $name, description: $description, active: $active) {
      specialty {
        id
        name
        description
        active
      }
      errors
    }
  }
`

export const DELETE_SPECIALTY_MUTATION = gql`
  mutation DeleteSpecialty($id: ID!) {
    deleteSpecialty(id: $id) {
      success
      errors
    }
  }
`
