// pages/patients/[id]/edit.tsx
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PATIENT } from "../../../graphql/queries";
import { UPDATE_PATIENT } from "../../../graphql/mutations";
import PatientForm from "../../../components/PatientForm";

export default function EditPatient() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(GET_PATIENT, { variables: { id } });
  const [updatePatient] = useMutation(UPDATE_PATIENT);

  if (loading) return <p>Loading...</p>;
  if (!data?.patient) return <p>Paciente não encontrado</p>;

  const onSubmit = async (formData: any) => {
    const { data: result } = await updatePatient({ variables: { id, ...formData }});
    if (result.updatePatient.errors.length === 0) {
      router.push("/patients");
    } else {
      alert(result.updatePatient.errors.join("\n"));
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Editar paciente</h1>
      <PatientForm defaultValues={data.patient} onSubmit={onSubmit} />
    </div>
  );
}
