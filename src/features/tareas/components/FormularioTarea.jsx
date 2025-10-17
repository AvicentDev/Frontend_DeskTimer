import { useContext, useState, useEffect } from "react";
import useForm from "../../../hooks/useForm";
import { X } from "lucide-react";
import { AuthContext } from "../../../components/auth/AuthContext";

const animationStyles = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes slideOut { from { transform: translateY(0); opacity: 1; } to { transform: translateY(20px); opacity: 0; } }

  .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
  .animate-fadeOut { animation: fadeOut 0.3s ease-out forwards; }
  .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
  .animate-slideOut { animation: slideOut 0.3s ease-out forwards; }
`;

const TaskForm = ({ onClose, onSubmit, proyectos, title = "Agregar Tarea" }) => {
  const { user } = useContext(AuthContext);
  const [isClosing, setIsClosing] = useState(false);

  const { values, handleChange, resetForm } = useForm({
    nombre: "",
    descripcion: "",
    fecha_limite: "",
    estado: "",
    proyecto_id: null, // Inicializa como null
  });
  ;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("No hay usuario logueado");
      return;
    }
    const nuevaTarea = { ...values, usuario_id: user.id };
    handleClose();
    await onSubmit(nuevaTarea);
    resetForm();
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className={`fixed inset-0 flex items-center justify-center z-50 ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}>
        {/* Fondo oscuro semi-transparente */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Contenedor más vertical */}
        <div
          className={`relative bg-white rounded-lg shadow-xl w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 max-h-[85vh] overflow-y-auto p-6 transition-all duration-300 ${
            isClosing ? "animate-slideOut" : "animate-slideIn"
          }`}
        >
          {/* Header con color azul original */}
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 rounded-t-lg">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button onClick={handleClose} className="text-white hover:text-gray-200 transition">
              <X size={20} />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre de la tarea"
              value={values.nombre}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
              required
            />

            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={values.descripcion}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full h-24 resize-none focus:border-blue-500 focus:ring-blue-500"
            />

            <input
              type="date"
              name="fecha_limite"
              value={values.fecha_limite}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
              required
            />

            <select
              name="estado"
              value={values.estado}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccione un estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="finalizado">Finalizado</option>
            </select>

            <select
              name="proyecto_id"
              value={values.proyecto_id}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccione un proyecto</option>
              {proyectos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>

            {/* Botones alineados a la derecha */}
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={handleClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                Cancelar
              </button>
              <button type="submit" className="!bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                {title}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TaskForm;
