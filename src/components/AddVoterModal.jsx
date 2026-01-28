import { useState, useEffect } from "react";
import { getDepartments, getMunicipalities } from "../api/departments";
import { createVoter, assignCandidateToVoter } from "../api/voters";
import { getLeaders, getCandidatesByLeader } from "../api/leaders";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function AddVoterModal({ onClose, onVoterAdded }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    identification: "",
    gender: "",
    bloodType: "",
    birthDate: "",
    phone: "",
    address: "",
    departmentId: "",
    municipalityId: "",
    neighborhood: "",
    email: "",
    occupation: "",
    votingLocation: "",
    votingBooth: "",
    politicalStatus: "Active",
    leaderId: "",
    candidateIds: [],
  });

  const [departments, setDepartments] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar departamentos y líderes
  useEffect(() => {
    getDepartments()
      .then(setDepartments)
      .catch(() => setError("Error al cargar departamentos"));
    getLeaders()
      .then(setLeaders)
      .catch(() => setError("Error al cargar líderes"));
  }, []);

  // Cargar municipios al cambiar departamento
  useEffect(() => {
    if (form.departmentId) {
      getMunicipalities(form.departmentId)
        .then(setMunicipalities)
        .catch(() => setError("Error al cargar municipios"));
      setForm((prev) => ({ ...prev, municipalityId: "" }));
    }
  }, [form.departmentId]);

  // Cargar candidatos al cambiar líder
  useEffect(() => {
    if (form.leaderId) {
      getCandidatesByLeader(form.leaderId)
        .then((data) => {
          setCandidates(data);
          setForm((prev) => ({ ...prev, candidateIds: data.map((c) => c.id) }));
        })
        .catch(() => setError("Error al cargar candidatos"));
    } else {
      setCandidates([]);
      setForm((prev) => ({ ...prev, candidateIds: [] }));
    }
  }, [form.leaderId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleCandidate = (id) => {
    setForm((prev) => {
      const selected = prev.candidateIds.includes(id)
        ? prev.candidateIds.filter((cid) => cid !== id)
        : [...prev.candidateIds, id];
      return { ...prev, candidateIds: selected };
    });
  };

  const validateForm = () => {
    if (!form.firstName.trim()) return "Nombre es obligatorio";
    if (!form.lastName.trim()) return "Apellido es obligatorio";
    if (!form.identification.trim()) return "Identificación es obligatoria";
    if (!form.gender) return "Género es obligatorio";
    if (!form.birthDate) return "Fecha de nacimiento es obligatoria";
    if (!form.departmentId) return "Debe seleccionar un departamento";
    if (!form.municipalityId) return "Debe seleccionar un municipio";
    if (!form.leaderId) return "Debe seleccionar un líder";
    if (!form.candidateIds.length)
      return "Debe seleccionar al menos un candidato";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      return "Correo no es válido";
    if (form.phone && !/^\+?\d[\d\s\-]+$/.test(form.phone))
      return "Teléfono no es válido";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const voterPayload = {
      firstName: form.firstName,
      lastName: form.lastName,
      identification: form.identification,
      gender: form.gender,
      bloodType: form.bloodType || undefined,
      birthDate: form.birthDate,
      phone: form.phone || undefined,
      address: form.address || undefined,
      departmentId: Number(form.departmentId),
      municipalityId: Number(form.municipalityId),
      neighborhood: form.neighborhood || undefined,
      email: form.email || undefined,
      occupation: form.occupation || undefined,
      votingLocation: form.votingLocation || undefined,
      votingBooth: form.votingBooth || undefined,
      politicalStatus: form.politicalStatus,
    };

    console.log("Payload que se enviará al backend:", voterPayload);

    try {
      const voter = await createVoter(voterPayload);
      const voterId = voter.id;

      await Promise.all(
        form.candidateIds.map((candidateId) =>
          assignCandidateToVoter(voterId, Number(candidateId)),
        ),
      );

      onVoterAdded();
      onClose();
    } catch (err) {
      console.error("Error al crear votante:", err);
      setError(
        "Error al crear votante o asignar candidatos. Revisa los campos.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-lg border-t-8 border-orange-500 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-orange-500 text-center mb-6">
          Agregar Votante
        </h3>

        {error && (
          <p className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Nombre", name: "firstName" },
              { label: "Apellido", name: "lastName" },
              { label: "Identificación", name: "identification" },
              { label: "Teléfono", name: "phone" },
              { label: "Dirección", name: "address" },
              { label: "Barrio", name: "neighborhood" },
              { label: "Correo", name: "email", type: "email" },
              { label: "Ocupación", name: "occupation" },
              { label: "Ubicación de votación", name: "votingLocation" },
              { label: "Casilla", name: "votingBooth" },
              { label: "Estado político", name: "politicalStatus" },
              { label: "Fecha de nacimiento", name: "birthDate", type: "date" }, // ✅ Agregado
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="font-medium mb-1">{field.label}:</label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required={field.name === "birthDate"} // obligatorio
                />
              </div>
            ))}

            {[
              {
                label: "Género",
                name: "gender",
                options: [
                  { value: "", label: "Seleccione" },
                  { value: "M", label: "Masculino" },
                  { value: "F", label: "Femenino" },
                ],
              },
              { label: "Tipo de sangre", name: "bloodType", options: [] },
              {
                label: "Departamento",
                name: "departmentId",
                options: departments.map((d) => ({
                  value: d.id,
                  label: d.name,
                })),
              },
              {
                label: "Municipio",
                name: "municipalityId",
                options: municipalities.map((m) => ({
                  value: m.id,
                  label: m.name,
                })),
              },
              {
                label: "Líder",
                name: "leaderId",
                options: leaders.map((l) => ({
                  value: l.id,
                  label: `${l.name} (${l.municipality})`,
                })),
              },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="font-medium mb-1">{field.label}:</label>
                {field.options.length > 0 ? (
                  <select
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">Seleccione</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Candidatos */}
          <div>
            <label className="font-medium mb-2 block">Candidatos:</label>
            <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-orange-50">
              {candidates.map((c) => (
                <div key={c.id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={form.candidateIds.includes(c.id)}
                    onChange={() => toggleCandidate(c.id)}
                    className="mr-2"
                  />
                  <span>
                    {c.name} - {c.party}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-orange-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
