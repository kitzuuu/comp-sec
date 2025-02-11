"use client";

export function deleteUser() {
    return (
        <button
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md mb-2"
            onClick={async () => {
                try {
                    const res = await fetch("/api/delete-user", { method: "DELETE" });
                    const data = await res.json();
                    if (res.ok) {
                        console.log("User deleted successfully.");
                        alert("User deleted. Redirecting to homepage...");
                        window.location.href = "/";
                    } else {
                        console.log("Error deleting user:", data.message);
                    }
                } catch (error) {
                    console.log("Error deleting user:", error);
                }
            }}
        >
            Delete User
        </button>
    );
}
