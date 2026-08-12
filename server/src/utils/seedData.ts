import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { StudentProfile } from '../models/StudentProfile';

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/external_job_portal';
    await mongoose.connect(connStr);
    console.log('[Seed] Connected to MongoDB');

    // Clean existing seed users & categories
    await User.deleteMany({ email: { $in: [
      'student@institute.edu',
      'trainer@institute.edu',
      'hr@institute.edu',
      'admin@institute.edu'
    ] } });
    await Category.deleteMany({});

    // Seed Categories
    const categories = [
      { name: 'Software Development', slug: 'software-development', description: 'Fullstack, Frontend, Backend & Mobile roles' },
      { name: 'Data & Analytics', slug: 'data-analytics', description: 'Data Science, Machine Learning, Data Analyst & AI' },
      { name: 'DevOps & Cloud', slug: 'devops-cloud', description: 'AWS, Azure, Docker, Kubernetes & Site Reliability' },
      { name: 'Cyber Security', slug: 'cyber-security', description: 'Ethical Hacking, Network Security & Compliance' },
      { name: 'UI/UX & Product Design', slug: 'ui-ux-design', description: 'User Interface, Product Design & Figma' },
      { name: 'Quality Assurance & Testing', slug: 'qa-testing', description: 'Automation Testing, Selenium, QA Lead' },
    ];

    await Category.insertMany(categories);
    console.log('[Seed] Categories seeded successfully');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Seed Users
    const student = await User.create({
      name: 'Rahul Sharma (Student)',
      email: 'student@institute.edu',
      passwordHash,
      role: 'STUDENT',
      isActive: true,
      isEmailVerified: true,
      phone: '+91 9876543210',
    });

    await StudentProfile.create({
      userId: student._id,
      headline: 'Aspiring Full Stack Web Developer',
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
      experienceLevel: 'FRESHER',
      education: {
        degree: 'B.Tech',
        fieldOfStudy: 'Computer Science',
        institution: 'Technical Institute of Technology',
        passoutYear: 2026,
        cgpaOrPercentage: '8.8 CGPA',
      },
    });

    await User.create({
      name: 'Vikram Singh (Trainer)',
      email: 'trainer@institute.edu',
      passwordHash,
      role: 'TRAINER',
      isActive: true,
      isEmailVerified: true,
      phone: '+91 9876543211',
    });

    await User.create({
      name: 'Priya Sharma (HR Lead)',
      email: 'hr@institute.edu',
      passwordHash,
      role: 'HR',
      isActive: true,
      isEmailVerified: true,
      phone: '+91 9876543212',
    });

    await User.create({
      name: 'Admin User',
      email: 'admin@institute.edu',
      passwordHash,
      role: 'ADMIN',
      isActive: true,
      isEmailVerified: true,
      phone: '+91 9876543213',
    });

    console.log('[Seed] Default Users created:');
    console.log('  Student: student@institute.edu / password123');
    console.log('  Trainer: trainer@institute.edu / password123');
    console.log('  HR:      hr@institute.edu / password123');
    console.log('  Admin:   admin@institute.edu / password123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
