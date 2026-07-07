import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SeoHelmet from '../components/common/SeoHelmet';
import { BookOpen, Users, Clock, CheckCircle, Lock, Play } from 'lucide-react';
import { fetchCourseBySlug, enrollCourse } from '../features/courses/coursesSlice';
import { selectIsAuthenticated, selectUser } from '../features/auth/authSlice';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const CourseDetailPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: course, loading } = useSelector((s) => s.courses);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(fetchCourseBySlug(slug));
  }, [slug, dispatch]);

  const handleEnroll = () => {
    if (!isAuthenticated) return navigate('/login');
    dispatch(enrollCourse(course._id));
  };

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;
  if (!course || !course.course) return <div className="text-center py-32 text-accent">Kurs topilmadi</div>;

  const data = course.course;
  const isEnrolled = course.isEnrolled;

  return (
    <>
      <SeoHelmet
        title={`${data.seo?.metaTitle || data.title} – TOPEX Texnikumi`}
        description={data.seo?.metaDescription || data.shortDescription}
        keywords={data.seo?.metaKeywords}
        canonical={`https://topextexnikum.uz/courses/${data.slug || slug}`}
        ogImage={data.image ? (data.image.startsWith('http') ? data.image : `https://topextexnikum.uz${data.image}`) : "https://topextexnikum.uz/assets/logos/topex-logo.png"}
        ogType="article"
      >
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": data.title,
            "description": data.shortDescription || data.seo?.metaDescription || '',
            "provider": {
              "@type": "EducationalOrganization",
              "name": "TOPEX Texnikumi",
              "url": "https://topextexnikum.uz/"
            },
            "url": `https://topextexnikum.uz/courses/${data.slug || slug}`
          })}
        </script>
      </SeoHelmet>

      <div className="page-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap gap-2 mb-4">
                {data.category && <Badge variant="primary">{typeof data.category === 'string' ? data.category : data.category.name}</Badge>}
                <Badge variant="neutral">{t(`courses.level.${data.level}`)}</Badge>
                <Badge variant={data.isFree ? 'success' : 'warning'}>{data.isFree ? t('courses.free') : `${data.price?.toLocaleString()} so'm`}</Badge>
              </div>
              <h1 className="text-4xl font-black text-surface leading-tight mb-4">{data.title}</h1>
              <p className="text-accent text-lg">{data.shortDescription || data.description}</p>

              {data.instructor && (
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
                    {data.instructor.avatar
                      ? <img src={data.instructor.avatar} className="w-10 h-10 rounded-full object-cover" alt={data.instructor.name} loading="lazy" />
                      : data.instructor.name?.[0]}
                  </div>
                  <div>
                    <p className="text-surface font-medium">{data.instructor.name}</p>
                    <p className="text-accent text-sm">Instructor</p>
                  </div>
                </div>
              )}
            </motion.div>

            {data.whatYouLearn?.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-surface mb-4">Nima o'rganasiz</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.whatYouLearn.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-accent text-sm">
                      <CheckCircle size={16} className="text-green-400 mt-0.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-surface mb-4">Kurs tarkibi</h2>
              <div className="space-y-2">
                {data.lessons?.map((lesson, i) => (
                  <div key={lesson._id} className="glass-card px-4 py-3 flex items-center gap-3">
                    <span className="text-accent/50 text-sm w-6">{i + 1}</span>
                    {lesson.locked ? <Lock size={16} className="text-accent/50" /> : <Play size={16} className="text-secondary" />}
                    <span className={`flex-1 text-sm ${lesson.locked ? 'text-accent/60' : 'text-surface'}`}>{lesson.title}</span>
                    {lesson.isPreview && <Badge variant="success">Preview</Badge>}
                    {lesson.duration > 0 && (
                      <span className="text-accent/60 text-xs">{Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {data.description && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-surface mb-4">Kurs haqida</h2>
                <p className="text-accent leading-relaxed">{data.description}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card overflow-hidden">
              <div className="h-48 bg-primary-dark">
                {data.image ? (
                  <img src={data.image.startsWith('/assets') || data.image.startsWith('http') ? data.image : `${import.meta.env.VITE_API_URL || ''}${data.image}`} alt={data.title} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/30 to-primary">
                    <BookOpen size={48} className="text-accent/30" />
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <p className="text-3xl font-black text-surface">{data.isFree ? t('courses.free') : `${data.price?.toLocaleString()} so'm`}</p>

                {isEnrolled ? (
                  <Button className="w-full" variant="outline">O'rganishni davom ettirish</Button>
                ) : (
                  <Button className="w-full" onClick={handleEnroll}>
                    {t('courses.enroll')}
                  </Button>
                )}

                <div className="space-y-3 pt-2 border-t border-white/10">
                  {[
                    { icon: BookOpen, label: `${data.lessons?.length || 0} ${t('courses.lessons')}` },
                    { icon: Users, label: `${data.enrollmentCount} ${t('courses.students')}` },
                    { icon: Clock, label: data.duration || '—' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-accent text-sm">
                      <Icon size={15} className="text-secondary" /> {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailPage;
