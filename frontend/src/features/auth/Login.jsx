    import { useState } from "react";
    import LoadingSpinner from "../../components/ui/LoadingSpinner";
    import { useNavigate } from 'react-router-dom';
    import axiosInstance from "../../api/axiosInstance";

    export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate=useNavigate()

    function handleChange(e) {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Basic client-side validation
        if (!formData.email || !formData.password) {
        setError("Please fill in all fields.");
        setLoading(false);
        return;
        }

        try {
        const res = await axiosInstance.post("/login", formData);
        // Save token to localStorage or context
        localStorage.setItem("accessToken", res.data.access_token);
        // Redirect or update UI accordingly
        navigate("/notes")
        } catch (err) {
        setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && (
            <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">
            {error}
            </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
            <label className="block mb-2">
            Email
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded"
                placeholder="you@example.com"
            />
            </label>
            <label className="block mb-4">
            Password
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded"
                placeholder="••••••••"
                minLength={6}
            />
            </label>

            <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded text-white ${
                loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            >
            {loading ? <LoadingSpinner /> : "Login"}
            </button>
        </form>
        </div>
    );
    }
