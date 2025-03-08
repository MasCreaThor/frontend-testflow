import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Registro - TesFlow",
  description: "Crea una cuenta en TesFlow y accede a todas las funciones.",
};

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-800">
      <RegisterForm />
    </main>
  );
}
