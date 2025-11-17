# 🚀 Zoom Integration - Quick Start

## 5-Minute Setup Guide

### Step 1: Environment Variables (2 min)

Add to `backend/.env`:
```bash
ZOOM_ACCOUNT_ID=your_zoom_account_id
ZOOM_CLIENT_ID=your_zoom_client_id  
ZOOM_CLIENT_SECRET=your_zoom_client_secret
```

### Step 2: Frontend Routes (1 min)

Add routes to your app:
```javascript
// App.jsx or routes file
import MyCoursesWithZoom from './components/tutor/MyCoursesWithZoom';
import MyClassesWithZoom from './components/student/MyClassesWithZoom';

// Routes
<Route path="/my-courses" element={<MyCoursesWithZoom />} />  {/* Tutors */}
<Route path="/my-classes" element={<MyClassesWithZoom />} />  {/* Students */}
```

### Step 3: Navigation Links (1 min)

**Tutor Dashboard:**
```jsx
<Link to="/my-courses">My Courses & Live Sessions</Link>
```

**Student Dashboard:**
```jsx
<Link to="/my-classes">My Classes</Link>
```

### Step 4: Test (1 min)

1. Create a test course with one session
2. Check database - should see Zoom meeting details
3. Open `/my-courses` as tutor - see "Start Class" button
4. Enroll as student, open `/my-classes` - see "Join Class" button

---

## 📖 Quick API Reference

```javascript
// Create course with Zoom sessions
POST /api/courses
{
  title: "My Course",
  description: "...",
  schedule: [{
    topic: "Session 1",
    startTime: "2025-11-20T14:00:00Z",
    duration: 90
  }]
}

// Add session to existing course
POST /api/courses/:courseId/schedule
{
  topic: "New Session",
  startTime: "2025-11-22T14:00:00Z",
  duration: 60
}

// Get start URL (tutor)
GET /api/courses/:courseId/schedule/:scheduleId/start

// Get join URL (student)
GET /api/courses/:courseId/schedule/:scheduleId/join
```

---

## 🎯 Component Usage

### Tutor Component
```jsx
import MyCoursesWithZoom from './components/tutor/MyCoursesWithZoom';

// In your app
<MyCoursesWithZoom />
```

**Features:**
- ✅ View all courses
- ✅ Expand/collapse schedules
- ✅ Add new sessions via modal
- ✅ Start live classes
- ✅ Delete sessions
- ✅ Real-time status badges

### Student Component
```jsx
import MyClassesWithZoom from './components/student/MyClassesWithZoom';

// In your app
<MyClassesWithZoom />
```

**Features:**
- ✅ View enrolled courses
- ✅ See upcoming sessions
- ✅ Join live classes
- ✅ Progress tracking
- ✅ Status indicators

---

## 🔥 That's It!

Your Zoom integration is ready. Users can now:

**Tutors:**
1. Create courses with live sessions
2. Manage class schedules
3. Start live classes with one click

**Students:**
1. Enroll in courses
2. See upcoming sessions
3. Join live classes with one click

---

## 📚 Full Documentation

- **Complete Guide:** `ZOOM_WORKFLOW_GUIDE.md`
- **Implementation Details:** `ZOOM_IMPLEMENTATION_SUMMARY.md`
- **API Reference:** `RENDER_DEPLOYMENT_GUIDE.md`

---

**Need Help?**  
Check the troubleshooting section in `ZOOM_WORKFLOW_GUIDE.md`
