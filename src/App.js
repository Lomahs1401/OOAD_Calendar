import './App.module.scss';
import styles from './App.module.scss';
import classNames from 'classnames/bind';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';

const cx = classNames.bind(styles);

function App() {
    return (
        <div className={cx("App")}>
            <AuthContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </AuthContextProvider>
        </div>
    )
}

export default App;