"use client";
import { UserPlusIcon, DocumentArrowUpIcon, AcademicCapIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useState, ChangeEvent, FormEvent } from "react";
import { AuthService } from "@/services/auth.service";
import { RegisterRequest } from "@/types/auth.types";
import "@/styles/RegisterForm.css";

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterRequest>({ first_name: "", last_name: "", email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await AuthService.register(form);
      alert(`Bienvenido, ${response.user.first_name} ${response.user.last_name}!`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl overflow-hidden shadow-2xl register-container rounded-xl md:flex-row">
      <div className="hidden p-12 text-white md:block md:w-1/3" style={{ backgroundColor: "rgba(67, 56, 202, 0.7)" }}>
        <div className="flex flex-col justify-between h-full">
          <div>
            <h1 className="mb-6 text-3xl font-bold">TestFlow</h1>
            <p className="mb-8 text-lg">Únete hoy y transforma tu forma de estudiar.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                <UserPlusIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium">Crea tu cuenta</p>
                <p className="text-sm text-indigo-200">Personaliza tu perfil</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                <DocumentArrowUpIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium">Sube materiales</p>
                <p className="text-sm text-indigo-200">PDF, documentos, notas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium">Estudia mejor</p>
                <p className="text-sm text-indigo-200">Con preguntas personalizadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full p-8 md:w-2/3 glass-effect md:p-12">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full">
              <UserPlusIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-indigo-800">Crear tu cuenta</h1>
          <p className="text-gray-600">¡Comienza tu viaje de aprendizaje inteligente!</p>
        </div>
        {error && <p className="text-center text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="block mb-1 text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm form-input focus:outline-none focus:border-indigo-500"
                placeholder="Nombre"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block mb-1 text-sm font-medium text-gray-700">
                Apellido
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm form-input focus:outline-none focus:border-indigo-500"
                placeholder="Apellido"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm form-input focus:outline-none focus:border-indigo-500"
              placeholder="tu@email.com"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm form-input focus:outline-none focus:border-indigo-500"
              placeholder="Mínimo 8 caracteres"
              required
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            {loading ? "Registrando..." : "Crear cuenta"}
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
}