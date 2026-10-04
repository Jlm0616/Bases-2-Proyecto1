import React from 'react';

/**
 * Componente modal reutilizable para mostrar contenido en una ventana emergente
 * @param {Object} props - Propiedades del componente
 * @param {boolean} [props.isOpen] - Indica si el modal está abierto
 * @param {Function} [props.onClose] - Función para cerrar el modal
 * @param {React.ReactNode} [props.children] - Contenido del componente
 * @param {string} [props.ancho] - Ancho del modal: "normal" o "extra"
 * @returns {JSX.Element} El componente renderizado
 */
const Modal = ({ isOpen, onClose, children, ancho = 'normal' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-contenido modal-contenido-${ancho}`}>
        <button className="modal-cerrar" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
