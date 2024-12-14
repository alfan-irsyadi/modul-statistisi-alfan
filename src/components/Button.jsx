// components/Button.jsx
export const Button = ({ children, onClick, disabled, variant = 'default', className = '', icon }) => {
    const baseStyles = "px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2";
    const variants = {
      default: "bg-[#e0e5ec] text-gray-700 shadow-[-5px_-5px_10px_rgba(255,255,255,0.8),5px_5px_10px_rgba(0,0,0,0.15)] hover:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.8),inset_5px_5px_10px_rgba(0,0,0,0.15)]",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
      ghost: "text-gray-700 hover:bg-gray-100",
      icon: "p-2 rounded-full hover:bg-gray-100"
    };
  
    return (
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        {icon && <span className="w-4 h-4">{icon}</span>}
        {children}
      </button>
    );
  };