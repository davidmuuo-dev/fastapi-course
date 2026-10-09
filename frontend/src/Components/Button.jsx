export default function Button({ children, className = "" }) {
    return <button className={`rounded-lg ${className}`}>{children} </button>;
}
