import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, Star, Users, Clock, ChevronRight } from 'lucide-react';
import { fetchCourses, setFilters } from '../../redux/slices/courseSlice';
import { Card, Button, Input, Select, Badge, Loader, EmptyState } from '../../components/ui';

const CoursesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, loading, filters, pagination } = useSelector((state) => state.courses);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, limit: 12, ...filters }));
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
          <p className="text-lg text-indigo-100">
            Learn from expert tutors and advance your career
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
              className="flex-1"
            />
            
            <Select
              options={[
                { value: '', label: 'All Categories' },
                { value: 'programming', label: 'Programming' },
                { value: 'design', label: 'Design' },
                { value: 'business', label: 'Business' },
                { value: 'data-science', label: 'Data Science' },
              ]}
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="md:w-48"
            />

            <Select
              options={[
                { value: '', label: 'All Levels' },
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="md:w-48"
            />

            <Button type="submit" leftIcon={<Search className="h-5 w-5" />}>
              Search
            </Button>
          </form>
        </Card>

        {/* Loading State */}
        {loading && <Loader text="Loading courses..." />}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description="Try adjusting your filters or search terms"
            action={
              <Button onClick={() => dispatch(setFilters({ category: '', level: '', search: '' }))}>
                Clear Filters
              </Button>
            }
          />
        )}

        {/* Courses Grid */}
        {!loading && courses.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} navigate={navigate} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => dispatch(fetchCourses({ ...filters, page: pagination.page - 1 }))}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => dispatch(fetchCourses({ ...filters, page: pagination.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const CourseCard = ({ course, navigate }) => {
  const formatPrice = (price, currency) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency || 'NGN',
    }).format(price);
  };

  return (
    <Card hover className="cursor-pointer" onClick={() => navigate(`/courses/${course._id}`)}>
      {/* Course Image */}
      <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-lg -mx-6 -mt-6 mb-4 flex items-center justify-center">
        <BookOpen className="h-16 w-16 text-white opacity-50" />
      </div>

      {/* Course Info */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={course.level === 'beginner' ? 'success' : course.level === 'intermediate' ? 'warning' : 'danger'}>
            {course.level}
          </Badge>
          <Badge variant="info">{course.category}</Badge>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Course Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span>{course.rating?.toFixed(1) || '4.5'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.enrolledStudents?.length || 0} students</span>
          </div>
        </div>

        {/* Tutor */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {course.tutor?.name?.[0]?.toUpperCase() || 'T'}
            </div>
            <span className="text-sm text-gray-700">{course.tutor?.name || 'Tutor'}</span>
          </div>
          <div className="text-xl font-bold text-indigo-600">
            {formatPrice(course.price, course.currency)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CoursesPage;
