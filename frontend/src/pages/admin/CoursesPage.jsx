import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  Users as UsersIcon,
} from 'lucide-react';
import {
  fetchAllCourses,
  approveCourse,
  deleteCourse,
} from '../../redux/slices/adminSlice';
import {
  Card,
  Button,
  Input,
  Select,
  Modal,
  Avatar,
  Badge,
  Loader,
  EmptyState,
  useToast,
} from '../../components/ui';

const CoursesPage = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const { courses } = useSelector((state) => state.admin);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    tutorId: searchParams.get('tutorId') || '',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    dispatch(fetchAllCourses(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = {};
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k]) params[k] = newFilters[k];
    });
    setSearchParams(params);
  };

  const handleApproveCourse = async (courseId, approve) => {
    try {
      await dispatch(approveCourse({ courseId, isPublished: approve })).unwrap();
      addToast(
        approve ? 'Course approved successfully!' : 'Course unpublished',
        'success'
      );
      setShowApprovalModal(false);
      setSelectedCourse(null);
    } catch (error) {
      addToast(error || 'Failed to update course', 'error');
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await dispatch(deleteCourse(selectedCourse._id)).unwrap();
      addToast('Course deleted successfully!', 'success');
      setShowDeleteModal(false);
      setSelectedCourse(null);
    } catch (error) {
      addToast(error || 'Failed to delete course', 'error');
    }
  };

  const getStatusBadge = (isPublished) => {
    return isPublished ? (
      <Badge variant="success">Published</Badge>
    ) : (
      <Badge variant="warning">Pending</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              Course Management
            </h1>
            <p className="text-gray-600 mt-1">
              Approve, manage, and monitor all courses
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="warning" className="text-sm">
              {courses.list.filter((c) => !c.isPublished).length} Pending Approval
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by course title or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending Approval</option>
            </Select>
          </div>
        </Card>

        {/* Courses Table */}
        <Card>
          {courses.loading && courses.list.length === 0 ? (
            <div className="py-12 text-center">
              <Loader size="lg" />
            </div>
          ) : courses.list.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses found"
              description="Try adjusting your filters or wait for tutors to create courses"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.list.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-3">
                            {course.title?.charAt(0).toUpperCase() || 'C'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {course.title}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {course.description?.substring(0, 50)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar
                            src={course.tutorId?.profilePicture}
                            name={course.tutorId?.name || 'Unknown'}
                            size="sm"
                          />
                          <div className="ml-2">
                            <p className="text-sm font-medium text-gray-900">
                              {course.tutorId?.name || 'Unknown Tutor'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {course.tutorId?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(course.isPublished)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-gray-600">
                            <UsersIcon className="w-3 h-3 mr-1" />
                            {course.enrolledStudents?.length || 0} students
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <DollarSign className="w-3 h-3 mr-1" />$
                            {course.price || 0}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/courses/${course._id}`}
                            className="text-blue-600 hover:text-blue-700"
                            title="View Course"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {!course.isPublished ? (
                            <button
                              onClick={() => {
                                setSelectedCourse(course);
                                setShowApprovalModal(true);
                              }}
                              className="text-green-600 hover:text-green-700"
                              title="Approve Course"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApproveCourse(course._id, false)}
                              className="text-orange-600 hover:text-orange-700"
                              title="Unpublish Course"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {courses.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing {courses.list.length} of {courses.total} courses
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={courses.currentPage === 1}
                  onClick={() =>
                    handleFilterChange('page', courses.currentPage - 1)
                  }
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {courses.currentPage} of {courses.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={courses.currentPage === courses.totalPages}
                  onClick={() =>
                    handleFilterChange('page', courses.currentPage + 1)
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Approval Modal */}
        {selectedCourse && (
          <Modal
            isOpen={showApprovalModal}
            onClose={() => {
              setShowApprovalModal(false);
              setSelectedCourse(null);
            }}
            title="Approve Course"
            footer={
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedCourse(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleApproveCourse(selectedCourse._id, true)}
                >
                  Approve & Publish
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedCourse.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCourse.description}
                </p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Course Details:
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Tutor: {selectedCourse.tutorId?.name}</li>
                  <li>• Price: ${selectedCourse.price}</li>
                  <li>
                    • Created:{' '}
                    {new Date(selectedCourse.createdAt).toLocaleDateString()}
                  </li>
                </ul>
              </div>
              <p className="text-xs text-gray-500">
                Approving this course will make it visible to all students
              </p>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {selectedCourse && (
          <Modal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedCourse(null);
            }}
            title="Delete Course"
            footer={
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedCourse(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteCourse}>
                  Delete Course
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete{' '}
                <strong>{selectedCourse.title}</strong>? This will also remove:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>All enrolled students</li>
                <li>All assignments and submissions</li>
                <li>Course materials and content</li>
              </ul>
              <p className="text-sm font-semibold text-red-600">
                This action cannot be undone!
              </p>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
