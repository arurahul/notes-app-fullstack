    import axios from "axios";
    const axiosInstance=axios.create({
          baseURL: "http://localhost:5000",  // <- Should point to Flask backend
        withCredentials: true,
    })

    // Add token to each request automatically
    axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
    );

    // Response interceptor to handle 401
    axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
        console.warn('Unauthorized! Redirecting to login...');
        window.location.href = '/login';
        }
        return Promise.reject(error);
    }
    );

export default axiosInstance;