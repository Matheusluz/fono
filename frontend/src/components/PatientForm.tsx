// components/PatientForm.tsx
import React from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthdate?: string;
};

export default function PatientForm({ defaultValues, onSubmit }: { defaultValues?: Partial<FormValues>, onSubmit: (data: FormValues) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 8, maxWidth: 600 }}>
      <label>First name</label>
      <input {...register("firstName", { required: true })} />
      {errors.firstName && <span>Required</span>}

      <label>Last name</label>
      <input {...register("lastName", { required: true })} />
      {errors.lastName && <span>Required</span>}

      <label>Email</label>
      <input {...register("email")} />

      <label>Phone</label>
      <input {...register("phone")} />

      <label>Birthdate</label>
      <input type="date" {...register("birthdate")} />

      <button type="submit">Salvar</button>
    </form>
  );
}
