import fs from 'fs';
import path from 'path';

// Table interfaces matching the database schema requested
export interface User {
  id: string;
  name: string;
  nim: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: 'mahasiswa' | 'admin';
  is_verified: boolean;
  two_fa_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  faculty: string;
  study_program: string;
  semester: number;
  address: string;
  photo: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  course_code: string;
  course_name: string;
  lecturer_name: string;
  credits: number;
  semester: number;
  created_at: string;
  updated_at: string;
}

export interface StudentCourse {
  id: string;
  user_id: string;
  course_id: string;
  academic_year: string;
  semester: number;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  course_id: string;
  day: string; // 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
  start_time: string;
  end_time: string;
  room: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  user_id: string;
  course_id: string;
  meeting_number: number;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha';
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Grade {
  id: string;
  user_id: string;
  course_id: string;
  assignment_score: number;
  quiz_score: number;
  midterm_score: number;
  final_score: number;
  final_grade: number; // calculated weighted average
  letter_grade: string; // A, B+, B, C, etc.
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  invoice_code: string;
  payment_type: 'BPP' | 'SKS' | 'UTS' | 'UAS' | 'Praktikum' | 'Denda';
  amount: number;
  due_date: string;
  status: 'Lunas' | 'Belum Lunas' | 'Menunggu Verifikasi';
  proof_file: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'akademik' | 'pembayaran' | 'absensi' | 'nilai' | 'sistem' | 'pengumuman';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface OtpCode {
  id: string;
  user_id: string;
  email: string;
  otp_code: string;
  expires_at: string;
  is_used: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiPerformanceLog {
  id: string;
  api_type: 'REST' | 'SOAP';
  endpoint: string;
  method: string;
  response_time_ms: number;
  status_code: number;
  payload_size_bytes: number;
  created_at: string;
}

// Full DB State Schema
export interface DatabaseState {
  users: User[];
  student_profiles: StudentProfile[];
  courses: Course[];
  student_courses: StudentCourse[];
  schedules: Schedule[];
  attendances: Attendance[];
  grades: Grade[];
  payments: Payment[];
  notifications: Notification[];
  otp_codes: OtpCode[];
  api_performance_logs: ApiPerformanceLog[];
}

// Simple deterministic hash for demo passwords
export function hashPassword(pwd: string): string {
  let hash = 0;
  for (let i = 0; i < pwd.length; i++) {
    const char = pwd.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

const DB_FILE_PATH = path.resolve('./siakad_db.json');

export class DatabaseService {
  private static state: DatabaseState = {
    users: [],
    student_profiles: [],
    courses: [],
    student_courses: [],
    schedules: [],
    attendances: [],
    grades: [],
    payments: [],
    notifications: [],
    otp_codes: [],
    api_performance_logs: [],
  };

  static load(): DatabaseState {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf8');
        this.state = JSON.parse(raw);
        return this.state;
      }
    } catch (e) {
      console.error('Failed to load local DB state. Initializing a new one.', e);
    }
    
    this.seed();
    this.save();
    return this.state;
  }

  static save(): void {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.state, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to save DB state to file.', e);
    }
  }

  static get(): DatabaseState {
    if (this.state.users.length === 0) {
      return this.load();
    }
    return this.state;
  }

  static seed(): void {
    console.log('Seeding initial SIAKAD database...');
    const now = new Date().toISOString();

    // 1. Core Default User (Mahasiswa)
    const user1: User = {
      id: 'usr_mhs',
      name: 'John Doe',
      nim: '20240801001',
      email: 'mahasiswa@esaunggul.ac.id',
      passwordHash: hashPassword('password123'),
      phone: '081234567890',
      role: 'mahasiswa',
      is_verified: true,
      two_fa_enabled: true,
      created_at: now,
      updated_at: now,
    };

    // 2. Student Profile
    const profile1: StudentProfile = {
      id: 'prof_mhs',
      user_id: 'usr_mhs',
      faculty: 'Fasikom (Fakultas Ilmu Komputer)',
      study_program: 'Teknik Informatika',
      semester: 4,
      address: 'Jl. Arjuna Utara No. 9, Kebon Jeruk, Jakarta Barat, 11510',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      created_at: now,
      updated_at: now,
    };

    // 3. Courses (6 core courses for Teknik Informatika)
    const mockCourses: Course[] = [
      {
        id: 'crs_1',
        course_code: 'INF201',
        course_name: 'Pemrograman Web Enterprise',
        lecturer_name: 'Ir. Hendra Kusuma, M.Kom.',
        credits: 3,
        semester: 4,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'crs_2',
        course_code: 'INF202',
        course_name: 'Arsitektur Berorientasi Layanan (SOA)',
        lecturer_name: 'Dr. Rita Wahyuni, M.T.',
        credits: 3,
        semester: 4,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'crs_3',
        course_code: 'INF203',
        course_name: 'Sistem Manajemen Basis Data (RDBMS)',
        lecturer_name: 'Budi Hartono, S.Kom., M.MSI.',
        credits: 4,
        semester: 4,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'crs_4',
        course_code: 'INF204',
        course_name: 'Keamanan Jaringan & Informasi',
        lecturer_name: 'Yogi Saputra, M.Sc.',
        credits: 3,
        semester: 4,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'crs_5',
        course_code: 'INF205',
        course_name: 'Rekayasa Perangkat Lunak',
        lecturer_name: 'Siti Aminah, M.T.',
        credits: 3,
        semester: 4,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'crs_6',
        course_code: 'MAT206',
        course_name: 'Matematika Diskrit',
        lecturer_name: 'Prof. Bambang Supardi, M.Si.',
        credits: 3,
        semester: 4,
        created_at: now,
        updated_at: now,
      },
    ];

    // 4. Student Courses mappings
    const mockStudentCourses: StudentCourse[] = mockCourses.map((c, idx) => ({
      id: `sc_${idx + 1}`,
      user_id: 'usr_mhs',
      course_id: c.id,
      academic_year: '2025/2026',
      semester: 4,
      created_at: now,
      updated_at: now,
    }));

    // 5. Course Schedules
    const mockSchedules: Schedule[] = [
      {
        id: 'sch_1',
        course_id: 'crs_1',
        day: 'Senin',
        start_time: '08:00',
        end_time: '10:30',
        room: 'Lab Komputer 304',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'sch_2',
        course_id: 'crs_2',
        day: 'Selasa',
        start_time: '10:45',
        end_time: '13:15',
        room: 'Ruang Teori 205',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'sch_3',
        course_id: 'crs_3',
        day: 'Rabu',
        start_time: '08:00',
        end_time: '11:20',
        room: 'Lab RDBMS 301',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'sch_4',
        course_id: 'crs_4',
        day: 'Kamis',
        start_time: '13:30',
        end_time: '16:00',
        room: 'Ruang Teori 402',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'sch_5',
        course_id: 'crs_5',
        day: 'Jumat',
        start_time: '09:00',
        end_time: '11:30',
        room: 'Ruang Teori 104',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'sch_6',
        course_id: 'crs_6',
        day: 'Sabtu',
        start_time: '08:00',
        end_time: '10:30',
        room: 'PJJ Online Zoom',
        created_at: now,
        updated_at: now,
      },
    ];

    // 6. Attendances (14 simulated meetings per course)
    const mockAttendances: Attendance[] = [];
    const daysOffset = [14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98, 105];

    mockCourses.forEach(crs => {
      // Create 12 meetings for each course (already loaded in history)
      for (let meetNum = 1; meetNum <= 12; meetNum++) {
        const randVal = Math.random();
        let status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha' = 'Hadir';
        if (randVal > 0.95) status = 'Izin';
        else if (randVal > 0.92) status = 'Sakit';
        else if (randVal > 0.89) status = 'Alpha';

        const meetDate = new Date(Date.now() - (14 - meetNum) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        mockAttendances.push({
          id: `att_${crs.id}_${meetNum}`,
          user_id: 'usr_mhs',
          course_id: crs.id,
          meeting_number: meetNum,
          status,
          date: meetDate,
          created_at: now,
          updated_at: now,
        });
      }
    });

    // 7. Grades
    const mockGrades: Grade[] = [
      {
        id: 'grd_1',
        course_id: 'crs_1',
        user_id: 'usr_mhs',
        assignment_score: 88,
        quiz_score: 85,
        midterm_score: 82,
        final_score: 86,
        final_grade: 84.8,
        letter_grade: 'A',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'grd_2',
        course_id: 'crs_2',
        user_id: 'usr_mhs',
        assignment_score: 92,
        quiz_score: 90,
        midterm_score: 88,
        final_score: 94,
        final_grade: 91.6,
        letter_grade: 'A',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'grd_3',
        course_id: 'crs_3',
        user_id: 'usr_mhs',
        assignment_score: 78,
        quiz_score: 80,
        midterm_score: 75,
        final_score: 80,
        final_grade: 78.2,
        letter_grade: 'B+',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'grd_4',
        course_id: 'crs_4',
        user_id: 'usr_mhs',
        assignment_score: 85,
        quiz_score: 82,
        midterm_score: 80,
        final_score: 85,
        final_grade: 83.4,
        letter_grade: 'A-',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'grd_5',
        course_id: 'crs_5',
        user_id: 'usr_mhs',
        assignment_score: 95,
        quiz_score: 92,
        midterm_score: 90,
        final_score: 93,
        final_grade: 92.4,
        letter_grade: 'A',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'grd_6',
        course_id: 'crs_6',
        user_id: 'usr_mhs',
        assignment_score: 70,
        quiz_score: 75,
        midterm_score: 70,
        final_score: 72,
        final_grade: 71.3,
        letter_grade: 'B',
        created_at: now,
        updated_at: now,
      },
    ];

    // Helper calculate GPA
    // A=4, A-=3.7, B+=3.3, B=3, B-=2.7, C+=2.3, C=2, D=1, E=0

    // 8. Invoice Payments
    const mockPayments: Payment[] = [
      {
        id: 'pay_1',
        user_id: 'usr_mhs',
        invoice_code: 'INV202640101',
        payment_type: 'BPP',
        amount: 8500000,
        due_date: '2026-03-15',
        status: 'Lunas',
        proof_file: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=300',
        paid_at: '2026-03-12T09:44:12Z',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'pay_2',
        user_id: 'usr_mhs',
        invoice_code: 'INV202640102',
        payment_type: 'SKS',
        amount: 5400000,
        due_date: '2026-04-20',
        status: 'Lunas',
        proof_file: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=300',
        paid_at: '2026-04-18T14:22:00Z',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'pay_3',
        user_id: 'usr_mhs',
        invoice_code: 'INV202640103',
        payment_type: 'Praktikum',
        amount: 1500000,
        due_date: '2026-05-30',
        status: 'Belum Lunas',
        proof_file: null,
        paid_at: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'pay_4',
        user_id: 'usr_mhs',
        invoice_code: 'INV202640104',
        payment_type: 'UTS',
        amount: 1200000,
        due_date: '2026-06-10',
        status: 'Belum Lunas',
        proof_file: null,
        paid_at: null,
        created_at: now,
        updated_at: now,
      },
    ];

    // 9. Academic Notifications
    const mockNotifications: Notification[] = [
      {
        id: 'not_1',
        user_id: 'usr_mhs',
        title: 'Pengumuman Pengisian KRS Semester Antara',
        message: 'Pengisian KRS untuk Semester Antara akan dibuka mulai tanggal 1 Juni 2026 s.d. 15 Juni 2026. Harap hubungi dosen wali.',
        type: 'pengumuman',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'not_2',
        user_id: 'usr_mhs',
        title: 'Tagihan Pembayaran Praktikum',
        message: 'Tagihan Pembayaran Praktikum sebesar Rp1.500.000 mendekati tanggal jatuh tempo 30 Mei 2026. Harap segera melakukan pembayaran.',
        type: 'pembayaran',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'not_3',
        user_id: 'usr_mhs',
        title: 'Nilai UTS Telah Dirilis',
        message: 'Dosen Rita Wahyuni telah merilis nilai UTS untuk mata kuliah Arsitektur Berorientasi Layanan (SOA) dengan nilai: 88.',
        type: 'nilai',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'not_4',
        user_id: 'usr_mhs',
        title: 'Absensi Terhitung Hadir',
        message: 'Absensi Anda pada pertemuan ke-12 mata kuliah Pemrograman Web Enterprise telah terverifikasi sebagai Hadir.',
        type: 'absensi',
        is_read: true,
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      }
    ];

    // 10. Core performance history
    const mockLogs: ApiPerformanceLog[] = [
      {
        id: 'log_init_1',
        api_type: 'REST',
        endpoint: '/api/courses',
        method: 'GET',
        response_time_ms: 12,
        status_code: 200,
        payload_size_bytes: 844,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'log_init_2',
        api_type: 'SOAP',
        endpoint: '/soap/courses',
        method: 'POST',
        response_time_ms: 45,
        status_code: 200,
        payload_size_bytes: 3120,
        created_at: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: 'log_init_3',
        api_type: 'REST',
        endpoint: '/api/profile',
        method: 'GET',
        response_time_ms: 8,
        status_code: 200,
        payload_size_bytes: 412,
        created_at: new Date(Date.now() - 3400000).toISOString(),
      },
      {
        id: 'log_init_4',
        api_type: 'SOAP',
        endpoint: '/soap/profile',
        method: 'POST',
        response_time_ms: 38,
        status_code: 200,
        payload_size_bytes: 1450,
        created_at: new Date(Date.now() - 3300000).toISOString(),
      },
    ];

    this.state = {
      users: [user1],
      student_profiles: [profile1],
      courses: mockCourses,
      student_courses: mockStudentCourses,
      schedules: mockSchedules,
      attendances: mockAttendances,
      grades: mockGrades,
      payments: mockPayments,
      notifications: mockNotifications,
      otp_codes: [],
      api_performance_logs: mockLogs,
    };
  }
}
