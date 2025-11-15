require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const Post = require('./models/Post');
const ChatRoom = require('./models/ChatRoom');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📊 Connected to MongoDB. Starting seed...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Post.deleteMany({});
    await ChatRoom.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create admin users
    console.log('👤 Creating admin users...');
    
    const superadmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@emmidevcode.com',
      passwordHash: 'password123', // Model will hash this automatically
      role: 'superadmin',
      bio: 'Platform super administrator with full access',
      isActive: true,
      emailVerified: true
    });
    console.log('✅ Super Admin created:', superadmin.email);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@emmidevcode.com',
      passwordHash: 'password123', // Model will hash this automatically
      role: 'admin',
      bio: 'Platform administrator',
      isActive: true,
      emailVerified: true
    });
    console.log('✅ Admin created:', admin.email);

    // Create tutor users
    console.log('👨‍🏫 Creating tutor users...');
    
    const tutor1 = await User.create({
      name: 'EmmiDev',
      email: 'emmidev@emmidevcode.com',
      passwordHash: 'password123', // Model will hash this automatically
      role: 'tutor',
      bio: 'Full-stack developer and educator with 5+ years of experience',
      verifiedTutor: true,
      avatarUrl: 'https://ui-avatars.com/api/?name=EmmiDev&background=4F46E5&color=fff',
      isActive: true,
      emailVerified: true
    });
    console.log('✅ Tutor created:', tutor1.email);

    const tutor2 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@emmidevcode.com',
      passwordHash: 'password123', // Model will hash this automatically
      role: 'tutor',
      bio: 'Data Science expert and AI enthusiast',
      verifiedTutor: true,
      avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=10B981&color=fff',
      isActive: true,
      emailVerified: true
    });
    console.log('✅ Tutor created:', tutor2.email);

    // Create student users
    console.log('👨‍🎓 Creating student users...');
    
    const students = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@student.com',
        passwordHash: 'password123', // Model will hash this automatically
        role: 'student',
        bio: 'Aspiring web developer',
        avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff',
        emailVerified: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@student.com',
        passwordHash: 'password123', // Model will hash this automatically
        role: 'student',
        bio: 'Learning mobile development',
        avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Smith&background=EC4899&color=fff',
        emailVerified: true
      },
      {
        name: 'Mike Wilson',
        email: 'mike@student.com',
        passwordHash: 'password123', // Model will hash this automatically
        role: 'student',
        bio: 'Data science enthusiast',
        avatarUrl: 'https://ui-avatars.com/api/?name=Mike+Wilson&background=F59E0B&color=fff',
        emailVerified: true
      }
    ]);
    console.log(`✅ ${students.length} students created`);

    console.log('✅ All users created successfully');

    // Create sample courses
    console.log('📚 Creating courses...');
    
    const course1 = await Course.create({
      title: 'Complete MERN Stack Development',
      description: 'Learn MongoDB, Express, React, and Node.js from scratch to build full-stack applications',
      tutorId: tutor1._id,
      price: 25000,
      currency: 'NGN',
      category: 'Web Development',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      syllabus: [
        {
          title: 'Introduction to MERN Stack',
          description: 'Overview of the technologies',
          resources: [
            {
              title: 'Setup Guide',
              url: 'https://example.com/setup',
              type: 'article'
            }
          ],
          order: 1
        },
        {
          title: 'MongoDB Fundamentals',
          description: 'Database design and queries',
          resources: [],
          order: 2
        },
        {
          title: 'Building REST APIs with Express',
          description: 'Backend development',
          resources: [],
          order: 3
        },
        {
          title: 'React Frontend Development',
          description: 'Building user interfaces',
          resources: [],
          order: 4
        }
      ],
      tags: ['javascript', 'react', 'node', 'mongodb', 'full-stack'],
      isPublished: true,
      maxStudents: 50,
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-04-15')
    });

    const course2 = await Course.create({
      title: 'Python for Data Science',
      description: 'Master Python programming for data analysis, visualization, and machine learning',
      tutorId: tutor2._id,
      price: 30000,
      currency: 'NGN',
      category: 'Data Science',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
      syllabus: [
        {
          title: 'Python Basics',
          description: 'Variables, data types, and control structures',
          resources: [],
          order: 1
        },
        {
          title: 'NumPy and Pandas',
          description: 'Data manipulation libraries',
          resources: [],
          order: 2
        },
        {
          title: 'Data Visualization',
          description: 'Matplotlib and Seaborn',
          resources: [],
          order: 3
        }
      ],
      tags: ['python', 'data-science', 'machine-learning', 'pandas'],
      isPublished: true,
      maxStudents: 40
    });

    const course3 = await Course.create({
      title: 'Mobile App Development with React Native',
      description: 'Build cross-platform mobile apps for iOS and Android',
      tutorId: tutor1._id,
      price: 0, // Free course
      currency: 'NGN',
      category: 'Mobile Development',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      syllabus: [
        {
          title: 'React Native Setup',
          description: 'Environment configuration',
          resources: [],
          order: 1
        },
        {
          title: 'Core Components',
          description: 'Building UI components',
          resources: [],
          order: 2
        }
      ],
      tags: ['react-native', 'mobile', 'javascript', 'ios', 'android'],
      isPublished: true,
      maxStudents: 100
    });

    console.log('✅ Courses created');

    // Create chat rooms for courses
    const chatRoom1 = await ChatRoom.create({
      name: `${course1.title} - Group Chat`,
      type: 'course',
      courseId: course1._id,
      participants: [
        { userId: tutor1._id, role: 'admin' }
      ]
    });

    const chatRoom2 = await ChatRoom.create({
      name: `${course2.title} - Group Chat`,
      type: 'course',
      courseId: course2._id,
      participants: [
        { userId: tutor2._id, role: 'admin' }
      ]
    });

    const chatRoom3 = await ChatRoom.create({
      name: `${course3.title} - Group Chat`,
      type: 'course',
      courseId: course3._id,
      participants: [
        { userId: tutor1._id, role: 'admin' }
      ]
    });

    // Update courses with group IDs
    course1.groupId = chatRoom1._id;
    course2.groupId = chatRoom2._id;
    course3.groupId = chatRoom3._id;
    await course1.save();
    await course2.save();
    await course3.save();

    console.log('✅ Chat rooms created');

    // Enroll some students
    course1.enrolledStudents.push({
      studentId: students[0]._id,
      progress: 25
    });
    course1.enrolledStudents.push({
      studentId: students[1]._id,
      progress: 10
    });
    await course1.save();

    course3.enrolledStudents.push({
      studentId: students[0]._id,
      progress: 50
    });
    course3.enrolledStudents.push({
      studentId: students[2]._id,
      progress: 5
    });
    await course3.save();

    // Update users' enrolled courses
    await User.findByIdAndUpdate(students[0]._id, {
      enrolledCourses: [course1._id, course3._id]
    });
    await User.findByIdAndUpdate(students[1]._id, {
      enrolledCourses: [course1._id]
    });
    await User.findByIdAndUpdate(students[2]._id, {
      enrolledCourses: [course3._id]
    });

    console.log('✅ Students enrolled');

    // Create sample posts
    console.log('📝 Creating community posts...');
    
    await Post.insertMany([
      {
        authorId: tutor1._id,
        contentText: '🎉 Welcome to EmmiDev CodeBridge! Excited to have you all here. Let\'s learn and grow together! #coding #learning',
        visibility: 'public',
        hashtags: ['coding', 'learning'],
        likes: [students[0]._id, students[1]._id]
      },
      {
        authorId: students[0]._id,
        contentText: 'Just completed my first MERN project! 🚀 Thanks @EmmiDev for the amazing course!',
        visibility: 'public',
        courseId: course1._id,
        likes: [tutor1._id, students[1]._id],
        comments: [
          {
            authorId: tutor1._id,
            text: 'Congratulations! Keep up the great work! 👏',
            createdAt: new Date()
          }
        ]
      },
      {
        authorId: students[1]._id,
        contentText: 'Anyone else struggling with MongoDB aggregations? Would love some tips! #help #mongodb',
        visibility: 'public',
        hashtags: ['help', 'mongodb'],
        comments: [
          {
            authorId: tutor1._id,
            text: 'I\'ll be covering that in our next live class. Also check out the MongoDB docs!',
            createdAt: new Date()
          }
        ]
      }
    ]);

    console.log('✅ Posts created');

    console.log('\n🎉 Seed data created successfully!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                     SAMPLE ACCOUNTS                        ');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n👑 SUPER ADMIN:');
    console.log('   Email: superadmin@emmidevcode.com');
    console.log('   Password: password123');
    console.log('   Role: superadmin');
    console.log('\n🛡️  ADMIN:');
    console.log('   Email: admin@emmidevcode.com');
    console.log('   Password: password123');
    console.log('   Role: admin');
    console.log('\n👨‍🏫 TUTORS:');
    console.log('   1. Email: emmidev@emmidevcode.com');
    console.log('      Password: password123');
    console.log('      Name: EmmiDev (Verified)');
    console.log('   2. Email: sarah@emmidevcode.com');
    console.log('      Password: password123');
    console.log('      Name: Sarah Johnson (Verified)');
    console.log('\n👨‍🎓 STUDENTS:');
    console.log('   1. Email: john@student.com');
    console.log('      Password: password123');
    console.log('      Name: John Doe');
    console.log('   2. Email: jane@student.com');
    console.log('      Password: password123');
    console.log('      Name: Jane Smith');
    console.log('   3. Email: mike@student.com');
    console.log('      Password: password123');
    console.log('      Name: Mike Wilson');
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('\n📊 Database Summary:');
    console.log(`   • Users: 7 (2 Admins, 2 Tutors, 3 Students)`);
    console.log(`   • Courses: 3 (2 Paid, 1 Free)`);
    console.log(`   • Posts: 3`);
    console.log(`   • Chat Rooms: 3`);
    console.log('\n✅ You can now login with any of the above accounts!');
    console.log('═══════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
