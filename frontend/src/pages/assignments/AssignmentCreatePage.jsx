import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentPlusIcon, CalendarIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { createAssignment } from '../../redux/slices/assignmentSlice';
import { Card, Button, Input, Textarea, FileUpload, useToast } from '../../components/ui';

const AssignmentCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { creating } = useSelector((state) => state.assignment);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalPoints: 100,
    passingGrade: 70
  });
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      addToast('Please provide a title', 'error');
      return;
    }

    if (!formData.description.trim()) {
      addToast('Please provide a description', 'error');
      return;
    }

    if (!formData.dueDate) {
      addToast('Please select a due date', 'error');
      return;
    }

    // Check if due date is in the future
    const dueDate = new Date(formData.dueDate);
    const now = new Date();
    if (dueDate < now) {
      addToast('Due date must be in the future', 'error');
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('dueDate', formData.dueDate);
      submitData.append('totalPoints', formData.totalPoints);
      submitData.append('passingGrade', formData.passingGrade);
      submitData.append('courseId', courseId);

      // Append files
      files.forEach((file) => {
        submitData.append('files', file);
      });

      await dispatch(createAssignment(submitData)).unwrap();
      
      addToast('Assignment created successfully!', 'success');
      navigate(`/courses/${courseId}`);
    } catch (error) {
      addToast(error || 'Failed to create assignment', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Back to Course
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <DocumentPlusIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Assignment</h1>
              <p className="text-gray-600 mt-1">Create a new assignment for this course</p>
            </div>
          </div>
        </div>

        {/* Create Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Title *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Week 1 Project - Build a Calculator"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed instructions for the assignment..."
                rows={8}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Include objectives, requirements, and any specific instructions
              </p>
            </div>

            {/* Due Date and Points Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Due Date *
                </label>
                <Input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Total Points */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Points *
                </label>
                <Input
                  type="number"
                  name="totalPoints"
                  value={formData.totalPoints}
                  onChange={handleChange}
                  min="1"
                  max="1000"
                  required
                />
              </div>

              {/* Passing Grade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Grade *
                </label>
                <Input
                  type="number"
                  name="passingGrade"
                  value={formData.passingGrade}
                  onChange={handleChange}
                  min="0"
                  max={formData.totalPoints}
                  required
                />
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <PaperClipIcon className="w-4 h-4 inline mr-1" />
                Attachments (Optional)
              </label>
              <FileUpload
                files={files}
                onChange={setFiles}
                accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.jpeg,.png"
                maxSize={10}
                multiple
              />
              <p className="text-xs text-gray-500 mt-2">
                Upload reference materials, starter files, or instructions (Max 10MB per file)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/courses/${courseId}`)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Assignment'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Creating Assignments</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Be clear and specific about what you expect from students</li>
            <li>• Include rubrics or grading criteria in the description</li>
            <li>• Set realistic due dates considering the complexity of the task</li>
            <li>• Attach reference materials, starter code, or examples when helpful</li>
            <li>• Use the AI grading feature to save time on initial assessments</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AssignmentCreatePage;
