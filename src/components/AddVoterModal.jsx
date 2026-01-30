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

  useEffect(() => {
    getDepartments().then(setDepartments);
    if (!voter) getLeaders().then(setLeaders);
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
    if (form.leaderId && !voter) {
      getCandidatesByLeader(form.leaderId).then((data) => {
        setCandidates(data);
        setForm((p) => ({ ...p, candidateIds: data.map((c) => c.id) }));
      });
    }
  }, [form.leaderId, voter]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleCandidate = (id) =>
    setForm((p) => ({
      ...p,
      candidateIds: p.candidateIds.includes(id)
        ? p.candidateIds.filter((c) => c !== id)
        : [...p.candidateIds, id],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      departmentId: Number(form.departmentId),
      municipalityId: Number(form.municipalityId),
    };

    try {
      let voterId;
      if (voter) {
        await updateVoter(voter.id, payload);
        voterId = voter.id;
      } else {
        const newVoter = await createVoter(payload);
        voterId = newVoter.id;
        await Promise.all(
          form.candidateIds.map((id) =>
            assignCandidateToVoter(voterId, Number(id)),
          ),
        );
      }
      onVoterAdded();
      onClose();
    } catch {
      setError("Error al guardar la información.");
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
              ["Nombre", "firstName"],
              ["Apellido", "lastName"],
              ["Identificación", "identification"],
              ["Teléfono", "phone"],
              ["Dirección", "address"],
              ["Barrio", "neighborhood"],
              ["Correo", "email"],
              ["Ocupación", "occupation"],
              ["Lugar de votación", "votingLocation"],
              ["Casilla", "votingBooth"],
              ["Fecha de nacimiento", "birthDate", "date"],
            ].map(([label, name, type]) => (
              <div key={name}>
                <label className="text-sm font-medium text-gray-700">
                  {label}
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
              label="Departamento"
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
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
              >
                <option value="">Seleccione</option>
                {leaders.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.municipality})
                  </option>
                ))}
              </Select>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Candidatos
                </label>
                <div className="mt-2 border rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                  {candidates.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={form.candidateIds.includes(c.id)}
                        onChange={() => toggleCandidate(c.id)}
                      />
                      {c.name} — {c.party}
                    </label>
                  ))}
                </div>
              </div>
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

function Select({ label, children, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        {...props}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400"
      >
        {children}
      </select>
    </div>
  );
}
