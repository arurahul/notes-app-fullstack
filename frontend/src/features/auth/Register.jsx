    import { useState } from "react";
    import LoadingSpinner from "../components/LoadingSpinner";
    import axiosInstance from "../api/axiosInstance";
    import { useNavigate } from "react-router-dom";
    export default function Register() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate=useNavigate()
    function handleChange(e) {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // Basic client-side validation
        if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all fields.");
        return;
        }
        if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
        }
        if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
        }

        setLoading(true);
        try {
        await axiosInstance.post("/register", {
            email: formData.email,
            password: formData.password,
        });
        // On successful registration, redirect to login or homepage
        navigate("/login");
        } catch (err) {
        setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
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

            <label className="block mb-2">
            Password
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full mt-1 p-2 border rounded"
                placeholder="••••••••"
            />
            </label>

            <label className="block mb-4">
            Confirm Password
            <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full mt-1 p-2 border rounded"
                placeholder="••••••••"
            />
            </label>

            <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded text-white ${
                loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            >
            {loading ? <LoadingSpinner /> : "Register"}
            </button>
        </form>
        </div>
    );
    }
