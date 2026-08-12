import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dns from 'dns';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { StudentProfile } from '../models/StudentProfile';

if (process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {
    // Ignore fallback if custom DNS set
  }
}

export async function autoSeedDefaultData() {
  const count = await User.countDocuments();
  if (count > 0) return;

  const categories = [
    { name: 'Software Development', slug: 'software-development', description: 'Fullstack, Frontend, Backend & Mobile roles' },
    { name: 'Data & Analytics', slug: 'data-analytics', description: 'Data Science, Machine Learning, Data Analyst & AI' },
    { name: 'DevOps & Cloud', slug: 'devops-cloud', description: 'AWS, Azure, Docker, Kubernetes & Site Reliability' },
    { name: 'Cyber Security', slug: 'cyber-security', description: 'Ethical Hacking, Network Security & Compliance' },
    { name: 'UI/UX & Product Design', slug: 'ui-ux-design', description: 'User Interface, Product Design & Figma' },
    { name: 'Quality Assurance & Testing', slug: 'qa-testing', description: 'Automation Testing, Selenium, QA Lead' },
  ];
  await Category.insertMany(categories);

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

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

  console.log('[Seed] Auto-seeded default users & categories into database');
}

export const connectDB = async (): Promise<void> => {
  const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/external_job_portal';
  const isAtlas = connStr.includes('mongodb+srv://');

  try {
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[MongoDB] Connected to ${isAtlas ? 'MongoDB Atlas Cloud' : 'database'}: ${conn.connection.host}`);
    await autoSeedDefaultData();
  } catch (error: any) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[MongoDB] Production MongoDB Atlas Connection Error:', error);
      process.exit(1);
    }
    console.log(`[MongoDB] Development connection failed. Falling back to In-Memory engine...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`[MongoDB] Connected to In-Memory Database: ${uri}`);
      await autoSeedDefaultData();
    } catch (memError) {
      console.error('[MongoDB] In-Memory DB connection error:', memError);
      process.exit(1);
    }
  }
};
