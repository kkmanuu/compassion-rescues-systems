const Alert = ({ type, message, onClose }) => {
    const alertClasses = {
      success: 'alert-success',
      error: 'alert-error',
      warning: 'alert-warning',
      info: 'alert-info'
    };
  
    return (
      <div className={`alert ${alertClasses[type]}`}>
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="alert-close">
            &times;
          </button>
        )}
      </div>
    );
  };
  
  export default Alert;