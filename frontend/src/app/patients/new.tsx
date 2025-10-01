// pages/patients/new.tsx
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import PatientForm from "../../components/PatientForm";
import { CREATE_PATIENT } from "../../graphql/mutations";

export default function NewPatient() {
  const router = useRouter();
  const [createPatient] = useMutation(CREATE_PATIENT);

  const onSubmit = async (data: any) => {
    const { data: result } = await createPatient({ variables: data });
    if (result.createPatient.errors.length === 0) {
      router.push("/patients");
    } else {
      alert(result.createPatient.errors.join("\n"));
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Novo paciente</h1>
      <PatientForm onSubmit={onSubmit} />
    </div>
  );
}
