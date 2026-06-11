import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CoursesPage from '../pages/CoursesPage';
import CourseDetailPage from '../pages/CourseDetailPage';
import GalleryPage from '../pages/GalleryPage';
import ContactPage from '../pages/ContactPage';
import BlogPage from '../pages/BlogPage';
import ArticleDetailPage from '../pages/ArticleDetailPage';
import ProfilePage from '../pages/ProfilePage';
import AdminDashboard    from '../pages/admin/AdminDashboard';
import AdminUsers        from '../pages/admin/AdminUsers';
import AdminCourses      from '../pages/admin/AdminCourses';
import AdminBlog         from '../pages/admin/AdminBlog';
import AdminApplications from '../pages/admin/AdminApplications';
import AdminGallery      from '../pages/admin/AdminGallery';
import AdminTestimonials from '../pages/admin/AdminTestimonials';
import AdminFAQ          from '../pages/admin/AdminFAQ';
import AdminScholarships from '../pages/admin/AdminScholarships';
import AdminSettings     from '../pages/admin/AdminSettings';
import AdminHomeVideos   from '../pages/admin/AdminHomeVideos';
import AdminSiteEditor   from '../pages/admin/AdminSiteEditor';
import AdminTeachers     from '../pages/admin/AdminTeachers';
import AdminDirections   from '../pages/admin/AdminDirections';

const AppRouter = () => (
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
);

export default AppRouter;
