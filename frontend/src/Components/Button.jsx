export default function Button({ onClick, children, className = "" }) {
    return (
        <button onClick={onClick} className={`rounded-lg ${className}`}>
            {children}{" "}
        </button>
    );
}
