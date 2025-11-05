export default function Spinner() {
    return (
        <div className="grid place-items-center p-6">
            <div
                className="h-6 w-6 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600"
                role="status"
                aria-label="loading"
            />
        </div>
    );
}