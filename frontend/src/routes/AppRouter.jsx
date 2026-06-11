import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import Spinner from '../components/ui/Spinner';

const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const CoursesPage = lazy(() => import('../pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('../pages/CourseDetailPage'));
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
import BlogPage from '../pages/BlogPage';
import ArticleDetailPage from '../pages/ArticleDetailPage';
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const AdminDashboard    = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsers        = lazy(() => import('../pages/admin/AdminUsers'));
const AdminCourses      = lazy(() => import('../pages/admin/AdminCourses'));
const AdminBlog         = lazy(() => import('../pages/admin/AdminBlog'));
const AdminApplications = lazy(() => import('../pages/admin/AdminApplications'));
const AdminGallery      = lazy(() => import('../pages/admin/AdminGallery'));
const AdminTestimonials = lazy(() => import('../pages/admin/AdminTestimonials'));
const AdminFAQ          = lazy(() => import('../pages/admin/AdminFAQ'));
const AdminScholarships = lazy(() => import('../pages/admin/AdminScholarships'));
const AdminSettings     = lazy(() => import('../pages/admin/AdminSettings'));
const AdminHomeVideos   = lazy(() => import('../pages/admin/AdminHomeVideos'));
const AdminSiteEditor   = lazy(() => import('../pages/admin/AdminSiteEditor'));
const AdminTeachers     = lazy(() => import('../pages/admin/AdminTeachers'));
const AdminDirections   = lazy(() => import('../pages/admin/AdminDirections'));

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

const AppRouter = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {/* Auth pages — без хедера/футера */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/aloqalar" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<ArticleDetailPage />} />
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users"        element={<AdminUsers />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="courses"      element={<AdminCourses />} />
        <Route path="blog"         element={<AdminBlog />} />
        <Route path="gallery"      element={<AdminGallery />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="faq"          element={<AdminFAQ />} />
        <Route path="scholarships" element={<AdminScholarships />} />
        <Route path="settings"     element={<AdminSettings />} />
        <Route path="home-videos"  element={<AdminHomeVideos />} />
        <Route path="site-editor"  element={<AdminSiteEditor />} />
        <Route path="teachers"     element={<AdminTeachers />} />
        <Route path="directions"   element={<AdminDirections />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default AppRouter;
