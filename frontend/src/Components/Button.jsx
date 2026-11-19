export default function Button({ onClick, type,children, className = "" }) {
    return (
        <button onClick={onClick} type={type} className={`rounded-lg ${className}`}>
            {children}{" "}
        </button>
    );
}
