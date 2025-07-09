    import { Link, useLocation, useNavigate } from 'react-router-dom';
    import { useEffect, useState } from 'react';

    const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('accessToken'));
    useEffect(() => {
        setToken(localStorage.getItem('accessToken'));
    }, [location.pathname]); // update if route changes

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    const linkClasses = (path) =>
        `px-4 py-2 rounded hover:bg-blue-500 hover:text-white ${
        location.pathname === path ? 'bg-blue-600 text-white' : 'text-blue-800'
        }`;

    return (
        <nav className="flex justify-between items-center p-4 bg-gray-100 shadow">
        <h1 className="text-xl font-bold text-blue-800">
            <Link to="/">📝 NotesApp</Link>
        </h1>

        <div className="space-x-4">
            {
          
            token ? (
            <>
                <Link to="/notes" className={linkClasses('/notes')}>
                Notes
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
                Logout
                </button>
            </>
            ) : (
            <>
                <Link to="/login" className={linkClasses('/login')}>
                Login
                </Link>
                <Link to="/register" className={linkClasses('/register')}>
                Register
                </Link>
            </>
            )}
        </div>
        </nav>
    );
    };

    export default Navbar;
