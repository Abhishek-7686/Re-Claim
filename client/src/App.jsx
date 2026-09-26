import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import About from "./pages/About";
import FoundItems from "./pages/FoundItems";
import ItemDetails from "./pages/ItemDetails";

import StudentDashboard from "./pages/StudentDashboard";
import ReportFoundItem from "./pages/ReportFoundItem";
import MyReports from "./pages/MyReports";
import MyClaims from "./pages/MyClaims";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import PendingItems from "./pages/PendingItems";
import ManageClaims from "./pages/ManageClaims";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                {/* ===== Public pages ===== */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/found-items" element={<FoundItems />} />

                {/* Any logged-in user (student or admin) can view item details */}
                <Route
                    path="/item/:id"
                    element={
                        <ProtectedRoute>
                            <ItemDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* ===== Student-only pages ===== */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute role="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/report-item"
                    element={
                        <ProtectedRoute role="student">
                            <ReportFoundItem />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-reports"
                    element={
                        <ProtectedRoute role="student">
                            <MyReports />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-claims"
                    element={
                        <ProtectedRoute role="student">
                            <MyClaims />
                        </ProtectedRoute>
                    }
                />

                {/* ===== Admin-only pages ===== */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/pending-items"
                    element={
                        <ProtectedRoute role="admin">
                            <PendingItems />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/manage-claims"
                    element={
                        <ProtectedRoute role="admin">
                            <ManageClaims />
                        </ProtectedRoute>
                    }
                />

                {/* ===== Fallback ===== */}
                <Route path="*" element={<Home />} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;
