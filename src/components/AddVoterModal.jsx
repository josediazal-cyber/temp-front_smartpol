import { useState, useEffect } from "react";
import { getDepartments, getMunicipalities } from "../api/departments";
import {
  createVoter,
  assignCandidateToVoter,
  updateVoter,
  getAssignedCandidate,
  updateAssignedCandidate,
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
    leaderId: "",
    candidateId: "",
  });

  const [departments, setDepartments] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assignedData, setAssignedData] = useState(null);

  useEffect(() => {
    getDepartments().then(setDepartments);
    getLeaders().then(setLeaders);

    // Si es edición, obtener datos de asignación actual
    if (voter) {
      getAssignedCandidate(voter.id).then((data) => {
        if (data) {
          setAssignedData(data);
          setForm((p) => ({
            ...p,
            leaderId: data.leaderId || "",
            candidateId: data.candidateId || "",
          }));
        }
      });
    }
  }, [voter]);

  useEffect(() => {
    if (form.departmentId) {
      getMunicipalities(form.departmentId).then(setMunicipalities);
    } else {
      setMunicipalities([]);
      setForm((p) => ({ ...p, municipalityId: "" }));
    }
  }, [form.departmentId]);

  useEffect(() => {
    if (form.leaderId) {
      getCandidatesByLeader(form.leaderId).then((data) => {
        setCandidates(data);
        // Si no estamos en edición, por defecto no seleccionar ninguno
        if (!voter) {
          setForm((p) => ({ ...p, candidateId: "" }));
        }
      });
    } else {
      setCandidates([]);
    }
  }, [form.leaderId, voter]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const requiredFields = {
      firstName: "Nombre",
      lastName: "Apellido",
      identification: "Identificación",
      votingLocation: "Lugar de votación",
      votingBooth: "Casilla",
      leaderId: "Líder",
      candidateId: "Candidato",
      departmentId: "Departamento",
      municipalityId: "Municipio",
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!form[field]) {
        setError(`${label} es requerido`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const voterPayload = {
      firstName: form.firstName,
      lastName: form.lastName,
      identification: form.identification,
      gender: form.gender || undefined,
      bloodType: form.bloodType || undefined,
      birthDate: form.birthDate || undefined,
      phone: form.phone || undefined,
      address: form.address || undefined,
      departmentId: Number(form.departmentId),
      municipalityId: Number(form.municipalityId),
      neighborhood: form.neighborhood || undefined,
      email: form.email || undefined,
      occupation: form.occupation || undefined,
      votingLocation: form.votingLocation,
      votingBooth: form.votingBooth,
      politicalStatus: form.politicalStatus || undefined,
    };

    try {
      let voterId;

      if (voter) {
        // Edición
        await updateVoter(voter.id, voterPayload);
        voterId = voter.id;

        // Actualizar asignación de candidato y líder
        if (form.candidateId && form.leaderId) {
          await updateAssignedCandidate(
            voterId,
            Number(form.candidateId),
            Number(form.leaderId),
          );
        }
      } else {
        // Creación
        const newVoter = await createVoter(voterPayload);
        voterId = newVoter.id;

        // Asignar candidato y líder
        if (form.candidateId && form.leaderId) {
          await assignCandidateToVoter(
            voterId,
            Number(form.candidateId),
            Number(form.leaderId),
          );
        }
      }

      onVoterAdded();
      onClose();
    } catch (err) {
      setError(err.message || "Error al guardar la información.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-xl font-bold text-orange-500">
            {voter ? "Editar Votante" : "Agregar Votante"}
          </h3>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]"
        >
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["Nombre", "firstName", null, true],
              ["Apellido", "lastName", null, true],
              ["Identificación", "identification", null, true],
              ["Teléfono", "phone"],
              ["Dirección", "address"],
              ["Barrio", "neighborhood"],
              ["Correo", "email"],
              ["Ocupación", "occupation"],
              ["Lugar de votación", "votingLocation", null, true],
              ["Casilla", "votingBooth", null, true],
              ["Fecha de nacimiento", "birthDate", "date"],
            ].map(([label, name, type, required]) => (
              <div key={name}>
                <label className="text-sm font-medium text-gray-700">
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type={type || "text"}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400"
                />
              </div>
            ))}

            {/* Selects */}
            <Select
              label="Género"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Seleccione</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </Select>

            <Select
              label="Tipo de sangre"
              name="bloodType"
              value={form.bloodType}
              onChange={handleChange}
            >
              <option value="">Seleccione</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </Select>

            <Select
              label="Departamento"
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>

            <Select
              label="Municipio"
              name="municipalityId"
              value={form.municipalityId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              {municipalities.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>

          {!voter && (
            <div className="mt-6 space-y-4">
              <Select
                label="Líder"
                name="leaderId"
                value={form.leaderId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                {leaders.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.municipality})
                  </option>
                ))}
              </Select>

              <Select
                label="Candidato"
                name="candidateId"
                value={form.candidateId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.party}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {voter && (
            <div className="mt-6 space-y-4">
              <Select
                label="Líder"
                name="leaderId"
                value={form.leaderId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                {leaders.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.municipality})
                  </option>
                ))}
              </Select>

              <Select
                label="Candidato"
                name="candidateId"
                value={form.candidateId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.party}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Select({ label, children, required, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...props}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400"
      >
        {children}
      </select>
    </div>
  );
}
