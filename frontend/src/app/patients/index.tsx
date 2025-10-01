// pages/patients/index.tsx
import { useQuery, useMutation } from "@apollo/client";
import Link from "next/link";
import React from "react";
import { GET_PATIENTS } from "../../graphql/queries";
import { DELETE_PATIENT, RESTORE_PATIENT } from "../../graphql/mutations";
import { useRouter } from "next/router";

export default function PatientsList() {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(GET_PATIENTS);
  const [deletePatient] = useMutation(DELETE_PATIENT);
  const [restorePatient] = useMutation(RESTORE_PATIENT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching patients</p>;

  const handleDelete = async (id: string) => {
    await deletePatient({ variables: { id } });
    refetch();
  };

  const handleRestore = async (id: string) => {
    await restorePatient({ variables: { id } });
    refetch();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Patients</h1>
      <Link href="/patients/new"><button>NOVO PACIENTE</button></Link>
      <table style={{ width: "100%", marginTop: 16 }}>
        <thead>
          <tr>
            <th>Nome</th><th>Email</th><th>Phone</th><th>Status</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.patients.map((p: any) => (
            <tr key={p.id}>
              <td>{p.firstName} {p.lastName}</td>
              <td>{p.email}</td>
              <td>{p.phone}</td>
              <td>{p.deletedAt ? "Deleted" : "Active"}</td>
              <td>
                <Link href={`/patients/${p.id}/edit`}><button>Editar</button></Link>
                {!p.deletedAt ? (
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                ) : (
                  <button onClick={() => handleRestore(p.id)}>Restore</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
