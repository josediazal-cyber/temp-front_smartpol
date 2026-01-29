import { useState, useEffect } from "react";
import { getDepartments, getMunicipalities } from "../api/departments";
import {
  createVoter,
  assignCandidateToVoter,
  updateVoter,
} from "../api/voters";
import { getLeaders, getCandidatesByLeader } from "../api/leaders";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function AddVoterModal({ onClose, onVoterAdded, voter }) {
  const [form, setForm] = useState({
    firstName: voter?.firstName || "",
    lastName: voter?.lastName || "",
    identification: voter?.identification || "",
    gender: voter?.gender || "",
    bloodType: voter?.bloodType || "",
    birthDate: voter?.birthDate || "",
    phone: voter?.phone || "",
    address: voter?.address || "",
    departmentId: voter?.departmentId || "",
    municipalityId: voter?.municipalityId || "",
    neighborhood: voter?.neighborhood || "",
    email: voter?.email || "",
    occupation: voter?.occupation || "",
    votingLocation: voter?.votingLocation || "",
    votingBooth: voter?.votingBooth || "",
    politicalStatus: voter?.politicalStatus || "Active",
    leaderId: voter?.leaderId || "",
    candidateIds: voter?.candidateIds || [],
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
    if (!voter) {
      getLeaders()
        .then(setLeaders)
        .catch(() => setError("Error al cargar líderes"));
    }
  }, [voter]);

  // Cargar municipios al cambiar departamento
  useEffect(() => {
    if (form.departmentId) {
      getMunicipalities(form.departmentId)
        .then(setMunicipalities)
        .catch(() => setError("Error al cargar municipios"));
    } else {
      setMunicipalities([]);
      setForm((prev) => ({ ...prev, municipalityId: "" }));
    }
  }, [form.departmentId]);

  // Cargar candidatos al cambiar líder (solo en crear)
  useEffect(() => {
    if (form.leaderId && !voter) {
      getCandidatesByLeader(form.leaderId)
        .then((data) => {
          setCandidates(data);
          setForm((prev) => ({ ...prev, candidateIds: data.map((c) => c.id) }));
        })
        .catch(() => setError("Error al cargar candidatos"));
    } else if (!voter) {
      setCandidates([]);
      setForm((prev) => ({ ...prev, candidateIds: [] }));
    }
  }, [form.leaderId, voter]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleCandidate = (id) => {
    setForm((prev) => ({
      ...prev,
      candidateIds: prev.candidateIds.includes(id)
        ? prev.candidateIds.filter((c) => c !== id)
        : [...prev.candidateIds, id],
    }));
  };

  const validateForm = () => {
    if (!form.firstName.trim()) return "Nombre es obligatorio";
    if (!form.lastName.trim()) return "Apellido es obligatorio";
    if (!form.identification.trim()) return "Identificación es obligatoria";
    if (!form.gender) return "Género es obligatorio";
    if (!form.birthDate) return "Fecha de nacimiento es obligatoria";
    if (!form.departmentId) return "Debe seleccionar un departamento";
    if (!form.municipalityId) return "Debe seleccionar un municipio";
    if (!voter && !form.leaderId) return "Debe seleccionar un líder";
    if (!voter && !form.candidateIds.length)
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
    if (validationError) return setError(validationError);

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

    try {
      let voterId;

      if (voter) {
        await updateVoter(voter.id, voterPayload);
        voterId = voter.id;
      } else {
        const newVoter = await createVoter(voterPayload);
        voterId = newVoter.id;

        // Asignar candidatos solo en crear
        await Promise.all(
          form.candidateIds.map((cid) =>
            assignCandidateToVoter(voterId, Number(cid)),
          ),
        );
      }

      onVoterAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error al guardar votante o asignar candidatos.");
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
          {voter ? "Editar Votante" : "Agregar Votante"}
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
              { label: "Fecha de nacimiento", name: "birthDate", type: "date" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="font-medium mb-1">{field.label}:</label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required={field.name === "birthDate"}
                />
              </div>
            ))}

            {/* Selects */}
            {[
              {
                label: "Género",
                name: "gender",
                options: [
                  { value: "M", label: "Masculino" },
                  { value: "F", label: "Femenino" },
                ],
              },
              {
                label: "Tipo de sangre",
                name: "bloodType",
                options: [
                  { value: "", label: "Seleccione" },
                  { value: "A+", label: "A+" },
                  { value: "A-", label: "A-" },
                  { value: "B+", label: "B+" },
                  { value: "B-", label: "B-" },
                  { value: "AB+", label: "AB+" },
                  { value: "AB-", label: "AB-" },
                  { value: "O+", label: "O+" },
                  { value: "O-", label: "O-" },
                ],
              },
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
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="font-medium mb-1">{field.label}:</label>
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
              </div>
            ))}

            {/* Mostrar líder y candidatos solo al crear */}
            {!voter && (
              <>
                <div className="flex flex-col">
                  <label className="font-medium mb-1">Líder:</label>
                  <select
                    name="leaderId"
                    value={form.leaderId}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">Seleccione</option>
                    {leaders.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.municipality})
                      </option>
                    ))}
                  </select>
                </div>

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
              </>
            )}
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
