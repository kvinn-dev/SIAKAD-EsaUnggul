import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  User,
  CreditCard,
  Bell,
  BarChart3,
  Activity,
  LogOut,
  Settings,
  ShieldCheck,
  Mail,
  Phone,
  ArrowRight,
  Lock,
  RefreshCw,
  Play,
  Trash2,
  Copy,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Grid,
  FileText,
  Check,
  Menu,
  X,
  Award,
  Terminal,
  ArrowUpDown,
  Cpu,
  Layers,
  Globe,
  Upload,
  UserCheck,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function App() {
  // Authentication & Session state
  const [user, setUser] = useState<any>(() => {
    try {
      const savedUser = localStorage.getItem("siakad_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("siakad_token") || null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Navigation
  const [page, setPage] = useState<
    "login" | "register" | "otp" | "forgot_password" | "dashboard"
  >(() => {
    try {
      const savedToken = localStorage.getItem("siakad_token");
      return savedToken ? "dashboard" : "login";
    } catch {
      return "login";
    }
  });
  const [activeTab, setActiveTab] = useState<
    | "ringkasan"
    | "mata_kuliah"
    | "absensi"
    | "nilai"
    | "pembayaran"
    | "notifikasi"
    | "profil"
    | "performa"
  >("ringkasan");

  // Sync token and user states with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("siakad_token", token);
    } else {
      localStorage.removeItem("siakad_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("siakad_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("siakad_user");
    }
  }, [user]);

  // Forms state
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    nim: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    study_program: "Teknik Informatika",
    faculty: "Fasikom (Fakultas Ilmu Komputer)",
  });
  const [otpForm, setOtpForm] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetForm, setResetForm] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  // OTP routing state
  const [otpUserId, setOtpUserId] = useState<string>("");
  const [otpEmail, setOtpEmail] = useState<string>("");
  const [otpPurpose, setOtpPurpose] = useState<"login" | "register" | "forgot">(
    "login",
  );

  // Academic Core States
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Simulation / Developer Panels state
  const [gmailInbox, setGmailInbox] = useState<any[]>([]);
  const [showDevPanel, setShowDevPanel] = useState<boolean>(false);
  const [isDevStreamExpanded, setIsDevStreamExpanded] = useState<boolean>(true);
  const [useWso2Gateway, setUseWso2Gateway] = useState<boolean>(true);
  const [esbLogs, setEsbLogs] = useState<string[]>([]);

  // Settings profile form
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    photo: "",
    two_fa_enabled: true,
  });
  const [pwdForm, setPwdForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Benchmarking states
  const [benchmarking, setBenchmarking] = useState<boolean>(false);
  const [benchResults, setBenchResults] = useState<{
    rest?: { time: number; size: number; format: string; raw: string };
    soap?: { time: number; size: number; format: string; raw: string };
  }>({});
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);

  // Security Simulation Playground states
  const [selectedAttack, setSelectedAttack] = useState<
    "DDOS" | "SQLI" | "BYPASS" | "XMLBOMB"
  >("DDOS");
  const [simulatingSecurity, setSimulatingSecurity] = useState<boolean>(false);
  const [securitySimResult, setSecuritySimResult] = useState<{
    attackType: string;
    useWso2: boolean;
    httpStatus: number;
    responseData: any;
    traceLogs: string[];
    wso2PolicyXml: string;
    mitigationStep: string;
  } | null>(null);

  // Feedback notifications (Alert banners)
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Helper triggering toast notifications
  const triggerAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Helper adding to simulation dev log console
  const addEsbLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEsbLogs((prev) => [`[${timestamp}] ${msg}`, ...prev].slice(0, 100));
  };

  // Auto-fetch dev records and logs (Gmail OTP, ESB Routing)
  useEffect(() => {
    // Poll notifications specifically (as they container simulated security OTP letters)
    // to populate the Gmail Simulator automatically!
    const interval = setInterval(() => {
      if (token || otpUserId) {
        let headers: any = {};

        // Pasang kredensial otorisasi: gunakan token utama jika ada,
        // atau gunakan otpUserId sebagai token sementara untuk mem-bypass 401 saat fase OTP
        headers["Authorization"] = `Bearer ${token || otpUserId}`;

        const endpoint = token
          ? "/api/notifications"
          : `/api/notifications?userId=${otpUserId}`;

        // Fetch all notifications from API to check for OTP logs
        fetch(endpoint, { headers })
          .then((r) => r.json())
          .then((res) => {
            if (res.success && res.data) {
              // Extract notifications that represent emails (e.g., from 'sistem')
              const mailLogs = res.data.filter(
                (n: any) =>
                  n.type === "sistem" ||
                  n.title.toLowerCase().includes("otp") ||
                  n.title.toLowerCase().includes("sandi"),
              );
              setGmailInbox(mailLogs);
            }
          })
          .catch(() => {});
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [token, otpUserId]);

  // Fetch initial student bundle when logged in
  const fetchStudentData = async (activeToken: string) => {
    setIsLoading(true);
    let apiPrefix = useWso2Gateway ? "/wso2/api" : "/api";
    const authHeaders = {
      Authorization: `Bearer ${activeToken}`,
      "Content-Type": "application/json",
    };

    addEsbLog(
      `Fetching Student bundle through ${useWso2Gateway ? "WSO2 Carbon Gateway" : "Direct API"}`,
    );

    try {
      // 1. Fetch Summary
      const sumRes = await fetch(`${apiPrefix}/dashboard/summary`, {
        headers: authHeaders,
      });
      const sumData = await sumRes.json();

      if (sumData.success) {
        setDashboardData(sumData.data);
        setProfileForm({
          name: sumData.data.student.name,
          phone: sumData.data.student.phone,
          address: sumData.data.student.address || "",
          photo: sumData.data.student.photo || "",
          two_fa_enabled: sumData.data.student.two_fa_enabled ?? true,
        });

        if (useWso2Gateway) {
          const gwMs = sumRes.headers.get("X-Gateway-Processing-Ms");
          const totalMs = sumRes.headers.get("X-API-Execution-Total-Ms");
          addEsbLog(
            `WSO2 Proxy OK: ${sumRes.status} | Gateway Overhead: ${gwMs}ms | Execution: ${totalMs}ms`,
          );
        }
      }

      // 2. Fetch Courses
      const crsRes = await fetch(`${apiPrefix}/courses`, {
        headers: authHeaders,
      });
      const crsData = await crsRes.json();
      if (crsData.success) setCourses(crsData.data);

      // 3. Fetch Schedules
      const schRes = await fetch(`${apiPrefix}/schedules`, {
        headers: authHeaders,
      });
      const schData = await schRes.json();
      if (schData.success) setSchedules(schData.data);

      // 4. Fetch Attendances
      const attRes = await fetch(`${apiPrefix}/attendance`, {
        headers: authHeaders,
      });
      const attData = await attRes.json();
      if (attData.success) setAttendance(attData.data);

      // 5. Fetch Grades
      const grdRes = await fetch(`${apiPrefix}/grades`, {
        headers: authHeaders,
      });
      const grdData = await grdRes.json();
      if (grdData.success) setGrades(grdData.data);

      // 6. Fetch Payments
      const payRes = await fetch(`${apiPrefix}/payments`, {
        headers: authHeaders,
      });
      const payData = await payRes.json();
      if (payData.success) setPayments(payData.data);

      // 7. Fetch Notifications
      const notRes = await fetch(`${apiPrefix}/notifications`, {
        headers: authHeaders,
      });
      const notData = await notRes.json();
      if (notData.success) setNotifications(notData.data);

      // 8. Fetch Performance comparison history logs
      fetchPerformanceLogs();
    } catch (err: any) {
      console.error(err);
      triggerAlert(
        "error",
        "Gagal memuat data akademik mahasiswa. Periksa koneksi backend.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPerformanceLogs = () => {
    fetch("/api/performance/comparison")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          // Map metrics for recharts
          const formatted = res.data.map((l: any) => ({
            id: l.id,
            api_type: l.api_type,
            endpoint: l.endpoint,
            time: l.response_time_ms,
            size: l.payload_size_bytes,
            created: new Date(l.created_at).toLocaleTimeString(),
          }));
          setPerformanceHistory(formatted);
        }
      })
      .catch(() => {});
  };

  // On mount, auto-load standard records if default credentials are set or verify fallback
  useEffect(() => {
    // If we have token, download student profile
    if (token) {
      fetchStudentData(token);
    }
  }, [token, useWso2Gateway]);

  // Handle Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      return triggerAlert(
        "error",
        "Silakan masukkan NIM atau Email dan Kata Sandi.",
      );
    }
    setIsLoading(true);
    addEsbLog(`Authenticating user credentials for '${loginForm.username}'`);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();

      if (data.success) {
        if (data.requires_otp) {
          setOtpUserId(data.userId);
          setOtpEmail(data.email);
          setOtpPurpose("login");
          setPage("otp");
          triggerAlert("success", data.message);
          addEsbLog(
            `Auth success. MFA OTP triggered. Simulating dispatch email message to ${data.email}.`,
          );
        } else {
          setToken(data.token);
          setUser(data.user);
          setPage("dashboard");
          triggerAlert("success", data.message);
          addEsbLog(
            `Access granted for ${data.user.name}. Session Token Generated.`,
          );
        }
      } else {
        triggerAlert(
          "error",
          data.message || "Kombinasi NIM/Email/Sandi salah.",
        );
        addEsbLog(`Authentication Denied: ${data.message}`);
      }
    } catch (err) {
      triggerAlert("error", "Gagal terhubung ke server autentikasi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Registration handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      return triggerAlert("error", "Konfirmasi kata sandi tidak cocok.");
    }
    setIsLoading(true);
    addEsbLog(`Registering new student profile with NIM: ${registerForm.nim}`);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      const data = await response.json();

      if (data.success) {
        setOtpUserId(data.userId);
        setOtpEmail(data.email);
        setOtpPurpose("register");
        setPage("otp");
        triggerAlert("success", data.message);
        addEsbLog(
          `Account created. Dispatched verification mail to: ${data.email}`,
        );
      } else {
        triggerAlert("error", data.message || "Pendaftaran gagal.");
        addEsbLog(`Registration failure: ${data.message}`);
      }
    } catch (err) {
      triggerAlert("error", "Gagal terhubung ke endpoint registrasi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpForm || otpForm.length < 5) {
      return triggerAlert("error", "Masukkan kode OTP 6-Digit lengkap.");
    }
    setIsLoading(true);
    addEsbLog(`Verifying security token ${otpForm} for User ID: ${otpUserId}`);

    try {
      if (otpPurpose === "forgot") {
        setResetForm((prev) => ({ ...prev, otp: otpForm }));
        setPage("forgot_password"); // Next step: reset password
        triggerAlert(
          "success",
          "OTP valid. Silakan buat kata sandi baru Anda.",
        );
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: otpUserId, otp: otpForm }),
      });
      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        setPage("dashboard");
        triggerAlert("success", "Akun berhasil diverifikasi. Selamat datang!");
        addEsbLog(`OTP verified. Activated session for ${data.user.name}.`);
      } else {
        triggerAlert("error", data.message || "OTP salah atau expired.");
        addEsbLog(`MFA Failure: ${data.message}`);
      }
    } catch (err) {
      triggerAlert("error", "Koneksi ke server verifikasi terputus.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    addEsbLog(`Re-generating security OTP for user`);
    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: otpUserId }),
      });
      const data = await response.json();
      if (data.success) {
        triggerAlert(
          "success",
          data.message || "OTP baru telah dikirim kembali ke email.",
        );
        addEsbLog(`Fired fresh verification OTP token.`);
      } else {
        triggerAlert("error", data.message || "Gagal mengirim ulang OTP.");
      }
    } catch (err) {
      triggerAlert("error", "Koneksi gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  // Lupa Password - Submit Email
  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail)
      return triggerAlert("error", "Tulis email terdaftar Anda.");
    setIsLoading(true);
    addEsbLog(`Initiating password recovery request for: ${forgotEmail}`);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpUserId(data.userId);
        setOtpEmail(forgotEmail);
        setOtpPurpose("forgot");
        setPage("otp");
        triggerAlert("success", data.message);
        addEsbLog(`Password recovery OTP has been sent towards ${forgotEmail}`);
      } else {
        triggerAlert("error", data.message);
        addEsbLog(`Forgot request unsuccessful: ${data.message}`);
      }
    } catch (err) {
      triggerAlert("error", "Gagal memproses sandi lupa.");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetForm.password !== resetForm.confirmPassword) {
      return triggerAlert("error", "Kata sandi baru tidak cocok.");
    }
    setIsLoading(true);
    addEsbLog(`Posting password update request with verification token`);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: otpUserId,
          otp: resetForm.otp,
          newPassword: resetForm.password,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setPage("login");
        triggerAlert("success", data.message);
        addEsbLog(
          `Credentials reset completely. Redirecting user to login panel.`,
        );
      } else {
        triggerAlert("error", data.message);
        addEsbLog(`Password reset error: ${data.message}`);
      }
    } catch (err) {
      triggerAlert("error", "Koneksi gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit Profil
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    addEsbLog(`Saving personal profile adjustments to database.`);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      });
      const data = await response.json();
      if (data.success) {
        triggerAlert("success", data.message);
        fetchStudentData(token!);
      } else {
        triggerAlert("error", data.message);
      }
    } catch (err) {
      triggerAlert("error", "Koneksi gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      return triggerAlert("error", "Konfirmasi kata sandi baru tidak cocok.");
    }
    setIsLoading(true);
    addEsbLog(
      `Pushing student security password update on current active profile.`,
    );

    try {
      const response = await fetch("/api/profile/change-password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: pwdForm.oldPassword,
          newPassword: pwdForm.newPassword,
        }),
      });
      const data = await response.json();
      if (data.success) {
        triggerAlert("success", data.message);
        setPwdForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        triggerAlert("error", data.message);
      }
    } catch (err) {
      triggerAlert("error", "Koneksi gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mark all alerts as read
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        triggerAlert("success", "Semua notifikasi ditandai dibaca.");
        fetchStudentData(token!);
      }
    } catch (e) {}
  };

  // Single read notification
  const handleReadSingle = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudentData(token!);
    } catch (e) {}
  };

  // Simulate Payment Transfer
  const handleSimulatePayment = async (paymentId: string) => {
    setIsLoading(true);
    addEsbLog(
      `Initiating Student Billing payment simulation for: ${paymentId}`,
    );

    try {
      const response = await fetch("/api/payments/upload-proof", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId,
          proofUrl:
            "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400",
        }),
      });
      const data = await response.json();
      if (data.success) {
        triggerAlert(
          "success",
          "Simulasi Pembayaran Berhasil! Bukti transfer dikirim ke keuangan.",
        );
        addEsbLog(
          `MOCK PAYMENT: Uploaded transactional receipt for billing invoice id: ${paymentId}.`,
        );
        fetchStudentData(token!);
      } else {
        triggerAlert("error", data.message);
      }
    } catch (err) {
      triggerAlert("error", "Koneksi gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger manual API Performance Benchmarking tests (REST vs SOAP)
  const handleTriggerBenchmark = async (type: "REST" | "SOAP") => {
    setBenchmarking(true);
    addEsbLog(`Spinning up custom performance probe on type: ${type}`);

    try {
      const res = await fetch("/api/performance/trigger-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();

      if (data.success) {
        setBenchResults((prev) => ({
          ...prev,
          [type.toLowerCase()]: {
            time: data.timeMs,
            size: data.payloadSize,
            format: data.payloadFormat,
            raw: data.rawPayload,
          },
        }));

        addEsbLog(
          `Bench Completed: ${type} took ${data.timeMs}ms | Payload: ${data.payloadSize} Bytes | Type: ${data.payloadFormat}`,
        );
        fetchPerformanceLogs();
      }
    } catch (e) {
      triggerAlert("error", "Gagal memicu uji performa API.");
    } finally {
      setBenchmarking(false);
    }
  };

  const clearBenchmarkLogs = async () => {
    try {
      await fetch("/api/performance/clear", { method: "POST" });
      addEsbLog(`Purged performance testing history logs successfully.`);
      fetchPerformanceLogs();
      triggerAlert("success", "Riwayat log pengujian performa dikosongkan.");
    } catch (e) {}
  };

  const handleTriggerSecuritySimulation = async (
    attackType: string,
    useWso2: boolean,
  ) => {
    setSimulatingSecurity(true);
    addEsbLog(
      `Launching simulated ${attackType} vector targeting SIAKAD endpoint via ${useWso2 ? "WSO2 Gateway" : "Direct API"}`,
    );

    try {
      const response = await fetch("/api/security/simulate-attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attackType, useWso2 }),
      });
      const data = await response.json();
      if (data.success) {
        setSecuritySimResult({
          attackType: data.attackType,
          useWso2: data.useWso2,
          httpStatus: data.httpStatus,
          responseData: data.responseData,
          traceLogs: data.traceLogs,
          wso2PolicyXml: data.wso2PolicyXml,
          mitigationStep: data.mitigationStep,
        });

        // Push relevant logs to ESB trace log in real-time
        data.traceLogs.forEach((logStr: string) => {
          addEsbLog(`[SEC-RULE-VAL] ${logStr}`);
        });

        if (useWso2) {
          triggerAlert(
            "success",
            `Simulasi ${attackType}: WSO2 memblokir serangan! Backend terlindungi.`,
          );
        } else {
          // If Direct API, it fails or leaks data
          triggerAlert(
            "error",
            `Simulasi ${attackType}: Direct API Rentan! Data bocor atau server crash.`,
          );
        }
      }
    } catch (err) {
      triggerAlert("error", "Gagal melancarkan simulasi serangan keamanan.");
    } finally {
      setSimulatingSecurity(false);
    }
  };

  // Auto layout values calculations
  const calculateGPAValue = () => {
    if (!grades || grades.length === 0) return 3.48; // dummy fallback
    let totalPoints = 0;
    let totalCredits = 0;

    const letterGradeToPoints: { [key: string]: number } = {
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      D: 1.0,
      E: 0.0,
    };

    grades.forEach((g) => {
      const gp = letterGradeToPoints[g.letter_grade] || 0;
      totalPoints += gp * g.credits;
      totalCredits += g.credits;
    });

    return totalCredits > 0
      ? Math.round((totalPoints / totalCredits) * 100) / 100
      : 0.0;
  };

  // Generate an automated academic/technical conclusion based on current logs
  const getAutoConclusion = () => {
    const rLogs = performanceHistory.filter((l) => l.api_type === "REST");
    const sLogs = performanceHistory.filter((l) => l.api_type === "SOAP");

    if (rLogs.length === 0 || sLogs.length === 0) {
      return "Tolong jalankan pengujian benchmark REST dan SOAP API di atas terlebih dahulu untuk memformulasikan deskripsi komparasi secara real-time berdasarkan data statistik!";
    }

    const avgRestTime =
      Math.round(
        (rLogs.reduce((acc, l) => acc + l.time, 0) / rLogs.length) * 100,
      ) / 100;
    const avgSoapTime =
      Math.round(
        (sLogs.reduce((acc, l) => acc + l.time, 0) / sLogs.length) * 100,
      ) / 100;

    const avgRestSize = Math.round(
      rLogs.reduce((acc, l) => acc + l.size, 0) / rLogs.length,
    );
    const avgSoapSize = Math.round(
      sLogs.reduce((acc, l) => acc + l.size, 0) / sLogs.length,
    );

    const speedDiff = Math.round((avgSoapTime / avgRestTime) * 10) / 10;
    const sizeDiff = Math.round((avgSoapSize / avgRestSize) * 10) / 10;

    return `Berdasarkan statistik real-time dari riwayat pengujian, REST API terbukti memiliki response time rata-rata ${avgRestTime}ms (sekitar ${speedDiff}x lebih cepat) dan ukuran payload rata-rata ${avgRestSize} Bytes (sekitar ${sizeDiff}x lebih kompak) dibandingkan SOAP XML API (${avgSoapTime}ms & ${avgSoapSize} Bytes). 

WSO2 ESB bertindak sebagai middleware integrasi yang tangguh dengan memproses transformasi routing dan menyuntikkan Carbon metadata header. Untuk sistem mahasiswa berskala mikro, REST JSON merupakan pilihan ideal karena ringan, mudah dibaca, dan berkecepatan tinggi. Namun, untuk integrasi level enterprise antar sistem perbankan/akreditasi kampus yang memerlukan kontrak layanan ketat, SOAP API dengan jaminan WSDL XML schema memberikan keamanan transaksi yang lebih formal dan handal.`;
  };

  // Mock standard course click details toggle
  const fetchCourseDetail = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setSelectedCourse(data.data);
      }
    } catch (e) {}
  };

  return (
    <div
      id="siakad-app-container"
      className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-sky-200"
    >
      {/* Alert Top Banner */}
      {alert && (
        <div
          id="global-alert-toast"
          className={`fixed top-[62px] sm:top-[74px] left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-3 px-3 py-1.5 rounded-full border shadow-md text-xs max-w-[92vw] sm:max-w-md transition-all duration-300 animate-in fade-in slide-in-from-top-1 ${
            alert.type === "success"
              ? "bg-white/95 backdrop-blur-md border-emerald-100/90 text-emerald-800 shadow-emerald-500/5"
              : "bg-white/95 backdrop-blur-md border-rose-100/90 text-rose-800 shadow-rose-500/5"
          }`}
        >
          <div className="flex items-center gap-1.5">
            {alert.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            )}
            <span className="font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
              {alert.message}
            </span>
          </div>
          <button
            onClick={() => setAlert(null)}
            className="p-0.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors ml-1 cursor-pointer shrink-0"
            title="Sembunyikan"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Brand Header Portal */}
      <header className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-900/10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 relative z-10">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-2.5 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 shadow-inner group-hover:bg-white/20 transition-colors">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>

            <div className="space-y-0.5">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-medium tracking-tight flex items-center gap-2 flex-wrap">
                <span className="font-display">SIAKAD ESA UNGGUL</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-sky-100/80 font-light tracking-wide hidden sm:block">
                Sistem Informasi Akademik Mahasiswa • Universitas Esa Unggul
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dev Tools Toggle */}
            <button
              onClick={() => {
                const nextVal = !showDevPanel;
                setShowDevPanel(nextVal);
                if (nextVal) {
                  triggerAlert(
                    "success",
                    'Mode Developer Aktif! Menu "Integrasi & Performa" kini tersedia di sidebar.',
                  );
                } else {
                  triggerAlert("success", "Mode Developer Dinonaktifkan.");
                  if (activeTab === "performa") setActiveTab("ringkasan");
                }
              }}
              className={`p-2 rounded-lg transition-all border shrink-0 ${
                showDevPanel
                  ? "bg-blueb-400 text-white/80 border-blue-300 shadow-md hover:bg-blue-300"
                  : "bg-white/10 text-white/80 border-white/10 hover:bg-white/20 hover:text-white"
              }`}
              title={
                showDevPanel ? "Sembunyikan Dev Tools" : "Aktifkan Dev Tools"
              }
            >
              <Terminal className="w-4 h-4" />
            </button>

            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm border border-white/10 pl-3 sm:pl-4 pr-1.5 py-1.5 rounded-lg">
                {/* Avatar */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-sky-300 to-indigo-400 flex items-center justify-center text-white font-bold text-[11px] sm:text-xs shrink-0 shadow-inner">
                  {user.name?.charAt(0) || "U"}
                </div>

                {/* User Info */}
                <div className="hidden sm:block text-right leading-tight">
                  <p className="text-[11px] font-semibold text-white truncate max-w-[120px]">
                    {user.name}
                  </p>
                  <p className="text-[9px] text-sky-200/80 font-mono tracking-wide">
                    {user.nim}
                  </p>
                </div>

                {/* Logout */}
                <button
                  onClick={() => {
                    setToken(null);
                    setUser(null);
                    setPage("login");
                    triggerAlert("success", "Berhasil logout dari sistem.");
                    addEsbLog(`Cleared credentials. Routed to auth.`);
                  }}
                  className="p-1.5 hover:bg-red-500/20 rounded-lg text-sky-100/70 hover:text-red-200 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Core */}
      <main className="grow max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Dynamic Left Column (Auth / Tabs Sidebar) */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          {/* Authed Sidebar Menu */}
          {user ? (
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-slate-200/80 p-4 shrink-0">
              <div className="text-center pb-4 mb-4 border-b border-slate-100">
                <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-sky-400 p-0.5 bg-sky-50 shadow-inner">
                  <img
                    src={
                      profileForm.photo ||
                      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"
                    }
                    alt="Foto Profil"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {user.name}
                </h3>
                <span className="inline-block text-[10px] text-white bg-indigo-500 font-semibold px-2 py-0.5 rounded-full mt-1">
                  Semester {dashboardData?.student?.semester || 4}
                </span>
                <p className="text-[11px] text-slate-500 mt-1 mt-0.5">
                  {dashboardData?.student?.study_program ||
                    "Teknik Informatika"}
                </p>
              </div>

              <div className="space-y-1">
                {[
                  { id: "ringkasan", label: "Ringkasan Akademik", icon: Grid },
                  { id: "mata_kuliah", label: "Mata Kuliah", icon: BookOpen },
                  { id: "absensi", label: "Laporan Absensi", icon: Activity },
                  { id: "nilai", label: "Catatan Transkrip", icon: Award },
                  {
                    id: "pembayaran",
                    label: "Keuangan & Tagihan",
                    icon: CreditCard,
                    count: payments.filter((p) => p.status === "Belum Lunas")
                      .length,
                  },
                  {
                    id: "notifikasi",
                    label: "Notifikasi Kampus",
                    icon: Bell,
                    count: notifications.filter((n) => !n.is_read).length,
                  },
                  { id: "profil", label: "Profil Saya", icon: User },
                  ...(showDevPanel
                    ? [
                        {
                          id: "performa",
                          label: "Integrasi & Performa",
                          icon: BarChart3,
                          highlight: true,
                        },
                      ]
                    : []),
                ].map((item: any) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setSelectedCourse(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-sky-500 text-white shadow-sm"
                          : item.highlight
                            ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-100"
                            : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${isActive ? "text-white" : item.highlight ? "text-amber-600" : "text-slate-400"}`}
                        />
                        <span className="font-display">{item.label}</span>
                      </div>
                      {item.count > 0 && !isActive && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.highlight || item.id === "pembayaran" ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-700"}`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Auth Panel Sidebar (Displays guidelines/info)
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-sky-500" />
                <span>Teknologi Integrasi</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Aplikasi ini mendukung perbandingan arsitektur SOA modern dengan
                menguji REST API (Format JSON yang ringan) dan SOAP Webservice
                (Format XML terproteksi WSDL kontrak) melalui WSO2 ESB.
              </p>
              <div className="space-y-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>REST: JSON Payload, Hemat bandwidth</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>SOAP: XML payload, Kontrak WSDL regulatif</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>MFA Sec: 2FA OTP Simulated Engine</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Dummy Auth Account Injector */}
          {!user && (
            <div className="bg-gradient-to-br from-indigo-50 to-sky-50 rounded-xl border border-sky-100 p-4 shrink-0">
              <h4 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Akun Uji Coba Cepat (Dummy)</span>
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                Klik tombol di bawah untuk langsung mengisi kolom input
                kredensial mahasiswa default Universitas Esa Unggul.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoginForm({
                    username: "mahasiswa@esaunggul.ac.id",
                    password: "password123",
                  });
                  triggerAlert(
                    "success",
                    "Kredensial mahasiswa berhasil disalin!",
                  );
                }}
                className="w-full text-center text-[11px] bg-white border border-indigo-200 text-indigo-700 font-semibold py-1.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
              >
                Injek Kredensial Pengujian
              </button>
            </div>
          )}
        </div>

        {/* Large Central Content Board */}
        <div className="lg:col-span-3 flex flex-col gap-6 grow">
          {/* Core App Loader spinner */}
          {isLoading && (
            <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs z-50 flex items-center justify-center">
              <div className="bg-white/95 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 border border-slate-100 animate-pulse text-sky-600 font-medium text-sm">
                <RefreshCw className="w-5 h-5 animate-spin text-sky-500" />
                <span>Memproses Data SIAKAD...</span>
              </div>
            </div>
          )}

          {/* ==========================================================
              A. AUTH ROTATOR PANEL (LOGIN, REGISTER, OTP, FORGOT)
              ========================================================== */}
          {!user && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 grow flex flex-col justify-center">
              {/* LOGIN PAGE */}
              {page === "login" && (
                <div id="auth-login-panel" className="max-w-md mx-auto w-full">
                  <div className="text-center mb-6">
                    <span className="text-[10px] font-semibold text-sky-600 tracking-widest uppercase bg-sky-50 px-2.5 py-1 rounded-full">
                      Gate Portal Mahasiswa
                    </span>
                    <h2 className="text-2xl font-bold text-slate-800 mt-2">
                      Masuk SIAKAD
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Gunakan alamat email Esa Unggul / NIM Anda
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        NIM atau Email Kampus
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                        <input
                          id="login-username-input"
                          type="text"
                          value={loginForm.username}
                          onChange={(e) =>
                            setLoginForm((prev) => ({
                              ...prev,
                              username: e.target.value,
                            }))
                          }
                          placeholder="Masukkan NIM atau Email kampus Anda"
                          className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase">
                          Kata Sandi
                        </label>
                        <button
                          type="button"
                          onClick={() => setPage("forgot_password")}
                          className="text-xs text-sky-600 hover:underline"
                        >
                          Lupa password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                        <input
                          id="login-password-input"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) =>
                            setLoginForm((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <button
                      id="login-submit-btn"
                      type="submit"
                      className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Masuk ke SIAKAD</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="text-center mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500">
                    <p>
                      Mahasiswa baru?{" "}
                      <button
                        onClick={() => setPage("register")}
                        className="text-indigo-600 font-semibold hover:underline"
                      >
                        Registrasi Akun di Sini
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {/* REGISTER PAGE */}
              {page === "register" && (
                <div
                  id="auth-register-panel"
                  className="max-w-lg mx-auto w-full"
                >
                  <div className="text-center mb-6">
                    <span className="text-[10px] font-bold text-sky-600 tracking-widest uppercase bg-sky-50 px-2.5 py-1 rounded-full font-mono">
                      Daftar Akun Baru
                    </span>
                    <h2 className="text-2xl font-bold text-slate-800 mt-2">
                      Registrasi SIAKAD
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Lengkapi dokumen integrasi kemahasiswaan Anda
                    </p>
                  </div>

                  <form
                    onSubmit={handleRegister}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={registerForm.name}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Contoh: John Doe"
                        className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        NIM Mahasiswa
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={11}
                        value={registerForm.nim}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            nim: e.target.value,
                          }))
                        }
                        placeholder="Contoh: 20240801273"
                        className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-400 transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        Email Kampus Gmail
                      </label>
                      <input
                        type="email"
                        required
                        value={registerForm.email}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="mahasiswa@esaunggul.ac.id"
                        className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-400 transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        Kata Sandi
                      </label>
                      <input
                        type="password"
                        required
                        value={registerForm.password}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        placeholder="••••••••"
                        className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        Konfirmasi Sandi
                      </label>
                      <input
                        type="password"
                        required
                        value={registerForm.confirmPassword}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="••••••••"
                        className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        required
                        value={registerForm.phone}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="Contoh: 081234567890"
                        className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-400 transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        Program Studi
                      </label>
                      <select
                        value={registerForm.study_program}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            study_program: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="Teknik Informatika">
                          Teknik Informatika
                        </option>
                        <option value="Sistem Informasi">
                          Sistem Informasi
                        </option>
                        <option value="Desain Komunikasi Visual">
                          Desain Komunikasi Visual
                        </option>
                        <option value="Manajemen">Manajemen</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        Fakultas Utama
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={registerForm.faculty}
                        className="w-full px-4 py-2 text-sm rounded-xl border border-slate-100 bg-slate-50 text-slate-500 font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      className="md:col-span-2 w-full mt-2 bg-sky-500 text-white font-bold py-2.5 rounded-xl hover:bg-sky-600 transition-all text-sm shadow-xs cursor-pointer"
                    >
                      Daftar Sekarang
                    </button>
                  </form>

                  <div className="text-center mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500">
                    <p>
                      Sudah punya akun?{" "}
                      <button
                        onClick={() => setPage("login")}
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        Masuk Ke Sini
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {/* OTP CODE VERIFICATION SCREEN */}
              {page === "otp" && (
                <div id="auth-otp-panel" className="max-w-md mx-auto w-full">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase bg-indigo-50 px-2.5 py-1 rounded-full font-mono">
                      Verifikasi Keamanan
                    </span>
                    <h2 className="text-2xl font-bold text-slate-800 mt-2">
                      Masukkan Kode OTP
                    </h2>
                    <p className="text-xs text-slate-500 mt-2">
                      Kami mengirimkan kode 6-digit rahasia ke kotak masuk
                      email:{" "}
                      <span className="font-semibold text-slate-700">
                        {otpEmail}
                      </span>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase block text-center mb-2">
                        Kode OTP 6-Digit
                      </label>
                      <input
                        id="otp-digits-input"
                        type="text"
                        maxLength={6}
                        required
                        value={otpForm}
                        onChange={(e) =>
                          setOtpForm(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="000000"
                        className="w-40 mx-auto block text-center tracking-[0.5em] text-xl py-2 px-3 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 rounded-lg"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-sm shadow-xs hover:bg-indigo-700 tracking-wide cursor-pointer"
                    >
                      Verifikasi & Masuk Dashboard
                    </button>
                  </form>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center gap-3">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-col">
                      <span>Tidak menerima email OTP?</span>
                      <button
                        onClick={handleResendOtp}
                        className="text-sky-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Kirim Ulang Kode OTP</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setPage("login")}
                      className="text-xs text-slate-400 hover:text-slate-600 underline"
                    >
                      Batal, Kembali Ke Login
                    </button>
                  </div>
                </div>
              )}

              {/* PASSWORD RESET SCREEN */}
              {page === "forgot_password" && (
                <div id="auth-forgot-panel" className="max-w-md mx-auto w-full">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                      Ubah Kata Sandi
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Masukkan kata sandi pengaman baru untuk akun SIAKAD Anda
                    </p>
                  </div>

                  {otpUserId ? (
                    // Resetting Form
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                          Kata Sandi Baru
                        </label>
                        <input
                          type="password"
                          required
                          value={resetForm.password}
                          onChange={(e) =>
                            setResetForm((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          placeholder="Minimal 6 karakter"
                          className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-400 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                          Konfirmasi Kata Sandi Baru
                        </label>
                        <input
                          type="password"
                          required
                          value={resetForm.confirmPassword}
                          onChange={(e) =>
                            setResetForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          placeholder="Masukkan ulang kata sandi baru"
                          className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-400 transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-sky-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
                      >
                        Pasang Kata Sandi Baru
                      </button>
                    </form>
                  ) : (
                    // Request recovery OTP Form
                    <form onSubmit={handleForgotEmail} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                          Alamat Email Terdaftar
                        </label>
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="mahasiswa@esaunggul.ac.id"
                          className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-400 transition-all font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Kirim OTP Penyetelan Ulang</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="text-center pt-3">
                        <button
                          type="button"
                          onClick={() => setPage("login")}
                          className="text-xs text-slate-400 hover:text-slate-600 underline"
                        >
                          Batal, Kembali Ke Login
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==========================================================
              B. DASHBOARD CORE TABS FOR LOGGED-IN MAHASISWA
              ========================================================== */}
          {user && (
            <div className="flex flex-col gap-6">
              {/* Welcome Sapaan Header Card */}
              <div className="bg-gradient-to-br from-indigo-50 via-sky-50 to-white rounded-2xl shadow-sm border border-sky-100 p-5 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 translate-y-4 translate-x-4 opacity-10 shrink-0 select-none">
                  <Award className="w-48 h-48 text-indigo-700" />
                </div>

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-5">
                  <div>
                    <span className="text-[10px] font-bold text-sky-600 tracking-wider bg-white border border-sky-100 px-2.5 py-1 rounded-full uppercase">
                      Sistem Portal Mahasiswa
                    </span>
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-2">
                      Selamat datang, {user.name}!
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
                      SIAKAD Esa Unggul mengintegrasikan seluruh operasional
                      perkuliahan Anda. Anda saat ini tercatat aktif di semester{" "}
                      {dashboardData?.student?.semester || 4} pada Program Studi{" "}
                      <span className="font-semibold text-slate-700">
                        {dashboardData?.student?.study_program ||
                          "Teknik Informatika"}
                      </span>
                      .
                    </p>
                  </div>

                  {/* Digital Live Clock */}
                  <div className="text-center py-2.5 px-4 bg-white rounded-xl shadow-xs border border-slate-100 shrink-0">
                    <span className="text-[10px] text-slate-400 block font-mono">
                      WAKTU SERVER UTC
                    </span>
                    <span className="text-sm font-bold text-indigo-600 font-mono tracking-wide">
                      {new Date().toLocaleTimeString("id-ID", {
                        timeZone: "Asia/Jakarta",
                        hour12: false,
                      })}
                    </span>
                    <p className="text-[9px] text-emerald-600 font-medium mt-0.5">
                      ● KONEKSI REST/SOAP AKTIF
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. TAB RINGKASAN AKADEMIK (DASHBOARD SUMMARY) */}
              {activeTab === "ringkasan" && (
                <div id="tab-dashboard-ringkasan" className="space-y-6">
                  {/* Key Stats Cards Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                      {
                        title: "Indeks Prestasi Kumulatif (IPK)",
                        value: calculateGPAValue().toFixed(2),
                        minTitle: "Skala 4.00",
                        color: "border-sky-200 text-sky-700 bg-sky-50/50",
                        icon: Award,
                      },
                      {
                        title: "Beban SKS Semester",
                        value: String(dashboardData?.stats?.total_sks || 19),
                        minTitle: "Batas Maks 24",
                        color:
                          "border-indigo-200 text-indigo-700 bg-indigo-50/50",
                        icon: BookOpen,
                      },
                      {
                        title: "Mata Kuliah Aktif",
                        value: String(
                          dashboardData?.stats?.active_courses ||
                            courses.length,
                        ),
                        minTitle: "Terdaftar KRS",
                        color:
                          "border-emerald-200 text-emerald-700 bg-emerald-50/50",
                        icon: Grid,
                      },
                      {
                        title: "Persentase Presensi",
                        value: `${dashboardData?.stats?.attendance_percentage ?? 95}%`,
                        minTitle: "Syarat UAS 75%",
                        color: "border-teal-200 text-teal-700 bg-teal-50/50",
                        icon: Activity,
                      },
                      {
                        title: "Tagihan Berjalan",
                        value: String(
                          dashboardData?.stats?.pending_bills ||
                            payments.filter((p) => p.status === "Belum Lunas")
                              .length,
                        ),
                        minTitle: "Belum Dilunasi",
                        color: "border-rose-200 text-rose-700 bg-rose-50/50",
                        icon: CreditCard,
                      },
                    ].map((stat: any, idx) => {
                      const StatIcon = stat.icon;
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl border flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow ${stat.color}`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <span className="text-[10px] text-slate-500 font-bold uppercase leading-tight flex-1">
                              {stat.title}
                            </span>
                            <StatIcon className="w-4 h-4 shrink-0 opacity-70 mt-0.5" />
                          </div>
                          <div>
                            <span className="text-xl sm:text-2xl font-black block tracking-tight">
                              {stat.value}
                            </span>
                            <span className="text-[10px] text-slate-500/80 block mt-0.5 font-medium">
                              {stat.minTitle}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dashboard Graphic Plots and Schedules Row */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Graph Panel Box */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 xl:col-span-2">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 text-sm">
                          Grafik Indeks Prestasi (IP) per Semester
                        </h3>
                        <span className="text-xs text-indigo-600 bg-indigo-50 font-bold px-2 py-0.5 rounded-lg border border-indigo-100">
                          Evaluasi Studi
                        </span>
                      </div>

                      <div className="h-60 w-full text-xs">
                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                          minWidth={0}
                          minHeight={0}
                        >
                          <AreaChart
                            data={[
                              { semester: "Smt 1", IP: 3.25 },
                              { semester: "Smt 2", IP: 3.42 },
                              { semester: "Smt 3", IP: 3.55 },
                              {
                                semester: "Smt 4 (Kini)",
                                IP: calculateGPAValue(),
                              },
                            ]}
                          >
                            <defs>
                              <linearGradient
                                id="gpaGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#6366f1"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#6366f1"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#f1f5f9"
                            />
                            <XAxis dataKey="semester" stroke="#94a3b8" />
                            <YAxis
                              domain={[0, 4]}
                              ticks={[1, 2, 3, 4]}
                              stroke="#94a3b8"
                            />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="IP"
                              stroke="#6366f1"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#gpaGradient)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-center mt-3 text-[10px] text-slate-400">
                        Catatan: IPK Kumulatif dihitung dinamais berdasarkan
                        bobot sks mata kuliah terdaftar di SIAKAD.
                      </div>
                    </div>

                    {/* Quick Course Schedule for Today */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-slate-800 text-sm">
                            Kalender Kuliah Mingguan
                          </h3>
                        </div>

                        <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                          {schedules.map((sch: any) => {
                            // Simple text highlight for specific day context in ID
                            const daysOfWeek = [
                              "Ahad",
                              "Senin",
                              "Selasa",
                              "Rabu",
                              "Kamis",
                              "Jumat",
                              "Sabtu",
                            ];
                            const todayName = daysOfWeek[new Date().getDay()]; // e.g. "Selasa"
                            const isToday = sch.day === todayName;

                            return (
                              <div
                                key={sch.id}
                                className={`p-2.5 rounded-xl border text-xs leading-normal transition-all ${
                                  isToday
                                    ? "bg-sky-50 border-sky-300 ring-1 ring-sky-300"
                                    : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      isToday
                                        ? "bg-sky-500 text-white"
                                        : "bg-slate-200 text-slate-600"
                                    }`}
                                  >
                                    {sch.day} {isToday ? "(Hari Ini)" : ""}
                                  </span>
                                  <span className="font-mono text-[10px] text-slate-500 font-bold">
                                    {sch.start_time} - {sch.end_time}
                                  </span>
                                </div>
                                <h4 className="font-bold text-slate-800 mt-1.5">
                                  {sch.course_name}
                                </h4>
                                <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                                  <span>{sch.room}</span>
                                  <span className="italic">
                                    {sch.lecturer_name}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab("mata_kuliah")}
                        className="w-full flex items-center justify-center gap-1.5 text-xs text-indigo-600 font-semibold py-2.5 mt-4 hover:bg-indigo-50 border-t border-slate-100 transition-colors group"
                      >
                        <span>Lihat Rincian Halaman Mata Kuliah</span>
                        <ChevronRight
                          size={14}
                          className="group-hover:translate-x-0.5 transition-transform shrink-0"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. TAB MATA KULIAH (COURSE DETAIL EXPLORER) */}
              {activeTab === "mata_kuliah" && (
                <div
                  id="tab-dashboard-courses"
                  className="space-y-6 animate-fade-in"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        Daftar Rencana Studi & Pengampu
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Daftar mata kuliah semester sedang Anda tempuh di Esa
                        Unggul.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {courses.map((crs: any) => {
                      return (
                        <div
                          key={crs.id}
                          className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-[10px] font-mono bg-sky-50 text-sky-700 px-2 py-0.5 rounded-lg border border-sky-100 font-extrabold">
                                {crs.course_code}
                              </span>
                              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg font-semibold">
                                {crs.credits} SKS
                              </span>
                            </div>
                            <h4 className="font-black text-slate-800 text-sm leading-snug">
                              {crs.course_name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-2 italic flex items-center gap-1">
                              <User className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                              <span>{crs.lecturer_name}</span>
                            </p>

                            {/* Short attendance indicator */}
                            <div className="mt-4 pt-4 border-t border-slate-100">
                              <div className="flex justify-between text-[11px] mb-1 text-slate-500">
                                <span>Rasio Kehadiran</span>
                                <span
                                  className={`font-mono font-bold ${crs.attendance_rate < 75 ? "text-rose-500" : "text-emerald-500"}`}
                                >
                                  {crs.attendance_rate}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full ${crs.attendance_rate < 75 ? "bg-rose-500" : "bg-emerald-500"}`}
                                  style={{ width: `${crs.attendance_rate}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => fetchCourseDetail(crs.id)}
                            className="w-full text-center text-xs font-bold text-sky-600 bg-sky-50 py-2 rounded-xl mt-5 hover:bg-sky-100 transition-colors"
                          >
                            Buka Detail Silabus & Tugas →
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Course Details Pane Overlay Drawer Mock if opened */}
                  {selectedCourse && (
                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-indigo-200 p-6 shadow-sm relative">
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="absolute right-4 top-4 p-1.5 hover:bg-slate-200 rounded-lg text-slate-400"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/2 space-y-4">
                          <div>
                            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-black border border-indigo-100">
                              {selectedCourse.course.course_code}
                            </span>
                            <h3 className="text-xl font-bold text-slate-800 mt-2">
                              {selectedCourse.course.course_name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                              Dosen Pengampu:{" "}
                              <span className="font-semibold">
                                {selectedCourse.course.lecturer_name}
                              </span>
                            </p>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs">
                            <span className="text-[11px] font-bold text-slate-600 block mb-2">
                              Kontrak Perkuliahan & Silabus
                            </span>
                            <p className="text-slate-500 leading-normal">
                              Mata kuliah berfokus pada integrasi arsitektural
                              SOA dan pertukaran data REST JSON dan SOAP XML.
                              Disuplai materi lab serta model review.
                            </p>
                          </div>

                          {/* Meeting History Logs */}
                          <div>
                            <span className="text-xs font-bold text-slate-700 block mb-2">
                              Riwayat Pertemuan Terbuka (12 Sesi)
                            </span>
                            <div className="grid grid-cols-4 gap-2">
                              {selectedCourse.attendance.map(
                                (att: any, idx: number) => (
                                  <div
                                    key={att.id}
                                    className="p-2 border border-slate-100 rounded-lg text-center bg-white"
                                  >
                                    <span className="text-[9px] text-slate-400 block font-mono">
                                      Sesi {idx + 1}
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-1 ${
                                        att.status === "Hadir"
                                          ? "bg-emerald-50 text-emerald-700"
                                          : "bg-amber-50 text-amber-500"
                                      }`}
                                    >
                                      {att.status}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="md:w-1/2 space-y-4">
                          <div>
                            <span className="text-xs font-bold text-slate-600 block mb-2">
                              Materi Perkuliahan (Downloadable)
                            </span>
                            <div className="space-y-1.5 text-xs">
                              {selectedCourse.materials.map(
                                (m: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100 hover:border-sky-300"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                      <span className="font-medium text-slate-700">
                                        {m.title}
                                      </span>
                                    </div>
                                    <span className="text-[9px] text-indigo-600 font-bold px-2 py-0.5 bg-indigo-50 rounded-lg">
                                      PDF
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-bold text-slate-600 block mb-2">
                              Tugas Kelas & Kuis
                            </span>
                            <div className="space-y-1.5 text-xs">
                              {selectedCourse.tasks.map(
                                (t: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100"
                                  >
                                    <span className="font-medium text-slate-700">
                                      {t.title}
                                    </span>
                                    <span
                                      className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${
                                        t.due === "Selesai"
                                          ? "bg-emerald-100 text-emerald-800"
                                          : "bg-amber-100 text-amber-800"
                                      }`}
                                    >
                                      {t.due}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. TAB DATA ABSENSI PRESENSI */}
              {activeTab === "absensi" && (
                <div id="tab-dashboard-absensi" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Laporan Absensi & Syarat Ujian
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Batas minimum kehadiran mahasiwa di Universitas Esa Unggul
                      adalah{" "}
                      <span className="font-bold text-slate-700">75%</span>{" "}
                      untuk mengikuti UAS.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
                    {attendance.map((att: any) => {
                      return (
                        <div
                          key={att.course_id}
                          className="p-4 rounded-xl border border-slate-100 bg-slate-50/50"
                        >
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono bg-slate-200 px-1.5 py-0.5 rounded-md font-bold">
                                  {att.course_code}
                                </span>
                                <h4 className="font-extrabold text-slate-800 text-xs md:text-sm">
                                  {att.course_name}
                                </h4>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1 italic">
                                {att.lecturer_name}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-slate-500 font-bold">
                                Rasio:
                              </span>
                              <span
                                className={`text-sm font-black font-mono ${att.is_safe ? "text-emerald-600" : "text-rose-600"}`}
                              >
                                {att.attendance_summary.presenceRate}% (Hadir{" "}
                                {att.attendance_summary.hadir}/
                                {att.attendance_summary.actualLogged} Sesi)
                              </span>
                              <span
                                className={`text-[9px] font-bold uppercase py-0.5 px-2 rounded-full ${
                                  att.is_safe
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {att.is_safe ? "Status Aman" : "Bahaya UAS"}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {/* Color Bar progress */}
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${att.is_safe ? "bg-emerald-500" : "bg-rose-500"}`}
                                style={{
                                  width: `${att.attendance_summary.presenceRate}%`,
                                }}
                              ></div>
                            </div>

                            {/* Meeting details status chip strip */}
                            <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-500 pt-1">
                              <span className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>{" "}
                                Hadir: {att.attendance_summary.hadir} Sesi
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-sky-500"></span>{" "}
                                Izin: {att.attendance_summary.izin} Sesi
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>{" "}
                                Sakit: {att.attendance_summary.sakit} Sesi
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-red-400"></span>{" "}
                                Alpha: {att.attendance_summary.alpha} Sesi
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. TAB CATATAN NILAI TRANSKRIP */}
              {activeTab === "nilai" && (
                <div id="tab-dashboard-grades" className="space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        Transkrip Nilai Akademik Kumulatif
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Status dan evaluasi perolehan nilai mata kuliah semester
                        ini.
                      </p>
                    </div>
                    <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 shrink-0 text-center">
                      <span className="text-[10px] text-slate-400 font-mono block">
                        IPK SEMESTER 4
                      </span>
                      <span className="text-xl font-black text-sky-700 font-mono">
                        {calculateGPAValue().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 font-extrabold uppercase text-slate-500 text-[10px]">
                          <tr>
                            <th className="p-4 font-mono">Kode</th>
                            <th className="p-4">Mata Kuliah</th>
                            <th className="p-4 text-center">SKS</th>
                            <th className="p-4 text-center">Tugas (20%)</th>
                            <th className="p-4 text-center">Kuis (10%)</th>
                            <th className="p-4 text-center">UTS (30%)</th>
                            <th className="p-4 text-center">UAS (40%)</th>
                            <th className="p-4 text-center">Nilai Akhir</th>
                            <th className="p-4 text-center">Huruf</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {grades.map((gr: any) => {
                            return (
                              <tr key={gr.id} className="hover:bg-slate-50/50">
                                <td className="p-4 font-mono text-slate-400">
                                  {gr.course_code}
                                </td>
                                <td className="p-4 font-bold text-slate-800">
                                  {gr.course_name}
                                </td>
                                <td className="p-4 text-center font-bold">
                                  {gr.credits}
                                </td>
                                <td className="p-4 text-center font-mono">
                                  {gr.assignment_score}
                                </td>
                                <td className="p-4 text-center font-mono">
                                  {gr.quiz_score}
                                </td>
                                <td className="p-4 text-center font-mono">
                                  {gr.midterm_score}
                                </td>
                                <td className="p-4 text-center font-mono">
                                  {gr.final_score}
                                </td>
                                <td className="p-4 text-center font-mono font-bold text-slate-900">
                                  {gr.final_grade}
                                </td>
                                <td className="p-4 text-center">
                                  <span
                                    className={`inline-block font-mono font-black border uppercase px-2 py-0.5 rounded-lg ${
                                      gr.letter_grade.startsWith("A")
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                        : gr.letter_grade.startsWith("B")
                                          ? "bg-blue-50 text-blue-800 border-blue-200"
                                          : "bg-amber-50 text-amber-800 border-amber-200"
                                    }`}
                                  >
                                    {gr.letter_grade}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. TAB PEMBAYARAN KEUANGAN */}
              {activeTab === "pembayaran" && (
                <div id="tab-dashboard-payments" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Tagihan & Kewajiban Finansial
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Kelola dan lunasi administrasi BPP, SKS, Praktikum, atau
                      tagihan UTS/UAS Anda.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {payments.map((pay: any) => {
                      const isPaid = pay.status === "Lunas";
                      const isPending = pay.status === "Menunggu Verifikasi";

                      return (
                        <div
                          key={pay.id}
                          className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                                {pay.invoice_code}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                  isPaid
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : isPending
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {pay.status}
                              </span>
                            </div>

                            <span className="text-xs text-slate-400 font-bold uppercase">
                              {pay.payment_type}
                            </span>
                            <h4 className="text-2xl font-black text-slate-800 mt-1">
                              Rp {pay.amount.toLocaleString("id-ID")}
                            </h4>

                            <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                              <p className="flex justify-between">
                                <span>Jatuh Tempo:</span>{" "}
                                <span className="font-semibold text-slate-700">
                                  {pay.due_date}
                                </span>
                              </p>
                              {pay.paid_at && (
                                <p className="flex justify-between">
                                  <span>Tanggal Bayar:</span>{" "}
                                  <span className="font-semibold text-slate-700">
                                    {new Date(pay.paid_at).toLocaleString(
                                      "id-ID",
                                    )}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>

                          {!isPaid && !isPending && (
                            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
                              {/* Trigger direct transfer simulation within dev space */}
                              <button
                                onClick={() => handleSimulatePayment(pay.id)}
                                className="w-full text-center py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:shadow-md text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Simulasikan Kirim Bukti Transfer</span>
                              </button>
                            </div>
                          )}

                          {isPending && (
                            <div className="mt-4 p-2.5 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-amber-800 leading-normal">
                              Bukti pembayaran Anda sedang diproses oleh Tim
                              Admin Keuangan Universitas Esa Unggul. Notifikasi
                              status akan dirilis segera.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. TAB NOTIFIKASI KAMPUS */}
              {activeTab === "notifikasi" && (
                <div id="tab-dashboard-notifications" className="space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        Kotak Pemberitahuan Mahasiswa
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Notifikasi akademik terbaru terkait perkuliahan dan
                        tagihan.
                      </p>
                    </div>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 py-1.5 px-3 rounded-lg hover:bg-indigo-100/80"
                    >
                      Tandai Semua Dibaca
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        Tidak ada notifikasi aktif untuk akun Anda saat ini.
                      </div>
                    ) : (
                      notifications.map((not: any) => {
                        return (
                          <div
                            key={not.id}
                            onClick={() =>
                              !not.is_read && handleReadSingle(not.id)
                            }
                            className={`p-4 transition-all leading-normal text-xs cursor-pointer ${
                              not.is_read
                                ? "bg-white hover:bg-slate-50/50"
                                : "bg-sky-50/40 hover:bg-sky-50 border-l-4 border-sky-500 font-medium"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1 gap-4">
                              <h4
                                className={`text-sm ${not.is_read ? "text-slate-700 font-bold" : "text-slate-900 font-black"}`}
                              >
                                {not.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-mono tracking-tight shrink-0">
                                {new Date(not.created_at).toLocaleDateString(
                                  "id-ID",
                                )}
                              </span>
                            </div>
                            <p className="text-slate-500 mt-1 leading-relaxed">
                              {not.message}
                            </p>

                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-500 font-mono">
                                Type: {not.type}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* 7. TAB EDIT PROFIL MAHASISWA */}
              {activeTab === "profil" && (
                <div id="tab-dashboard-profile" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Pengaturan Akun & Profil
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Perbarui kata sandi, lengkapi alamat rumah, dan ubah
                      pengaturan keamanan 2FA akun SIAKAD.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* General Profile form settings */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:col-span-2">
                      <h4 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wide">
                        Informasi Mahasiswa
                      </h4>

                      <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <label className="block font-bold text-slate-600 mb-1">
                              Nama Mahasiswa
                            </label>
                            <input
                              type="text"
                              required
                              value={profileForm.name}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="w-full p-2 border border-slate-300 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-600 mb-1">
                              Nomor Telepon Kontak
                            </label>
                            <input
                              type="text"
                              required
                              value={profileForm.phone}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  phone: e.target.value,
                                }))
                              }
                              className="w-full p-2 border border-slate-300 rounded-xl font-mono"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block font-bold text-slate-600 mb-1">
                              Alamat Terpadu
                            </label>
                            <textarea
                              rows={2}
                              value={profileForm.address}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  address: e.target.value,
                                }))
                              }
                              className="w-full p-2 border border-slate-300 rounded-xl text-xs"
                              placeholder="Jl. Arjuna Utara No.9 Kebon Jeruk..."
                            />
                          </div>

                          <div className="md:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-700 block text-xs">
                                Dua Faktor Autentikasi (2FA OTP)
                              </span>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                Wajibkan verifikasi OTP email Gmail untuk setiap
                                login.
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={profileForm.two_fa_enabled}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  two_fa_enabled: e.target.checked,
                                }))
                              }
                              className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="px-4 py-2 bg-sky-500 font-bold hover:bg-sky-600 text-white rounded-xl text-xs shadow-xs tracking-wide cursor-pointer"
                        >
                          Simpan Profil
                        </button>
                      </form>
                    </div>

                    {/* Change password widget panel */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                      <h4 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wide">
                        Kata Sandi Pengaman
                      </h4>

                      <form
                        onSubmit={handleChangePassword}
                        className="space-y-4 text-xs"
                      >
                        <div>
                          <label className="block font-bold text-slate-600 mb-1">
                            Kata Sandi Lama
                          </label>
                          <input
                            type="password"
                            required
                            value={pwdForm.oldPassword}
                            onChange={(e) =>
                              setPwdForm((prev) => ({
                                ...prev,
                                oldPassword: e.target.value,
                              }))
                            }
                            className="w-full p-2 border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-600 mb-1">
                            Kata Sandi Baru
                          </label>
                          <input
                            type="password"
                            required
                            value={pwdForm.newPassword}
                            onChange={(e) =>
                              setPwdForm((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                            className="w-full p-2 border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-600 mb-1">
                            Konfirmasi Kata Sandi Baru
                          </label>
                          <input
                            type="password"
                            required
                            value={pwdForm.confirmPassword}
                            onChange={(e) =>
                              setPwdForm((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            className="w-full p-2 border border-slate-300 rounded-xl"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full text-center py-2 bg-indigo-600 font-bold hover:bg-indigo-700 text-white rounded-xl text-xs shadow-xs tracking-wide cursor-pointer"
                        >
                          Perbarui Kata Sandi
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. TAB BENCHMARK KOMPARASI PERFORMA API (CORE BENCH DESIGN) */}
              {activeTab === "performa" && (
                <div id="tab-dashboard-performance" className="space-y-6">
                  {/* Title banner */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-amber-400 tracking-wider bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60 font-sans">
                          Developer Hub & Benchmark Console
                        </span>
                        <h3 className="text-xl font-bold font-display mt-3 flex items-center gap-2 text-slate-100">
                          <Activity className="w-5.5 h-5.5 text-indigo-400 animate-pulse" />
                          <span>Integrasi Middleware & Komparasi Performa</span>
                        </h3>
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-4xl font-display">
                          Selamat datang di Auditing & Benchmark Hub. Halaman
                          khusus ini memfasilitasi pengujian integritas
                          middleware WSO2 Enterprise Service Bus (Carbon ESB)
                          dan simulasi komparatif performa latensi throughput
                          REST vs SOAP secara langsung pada klaster server
                          SIAKAD.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 1. Gateway Routing Configuration Control */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] uppercase font-mono font-extrabold tracking-widest bg-slate-50 text-slate-800 border border-slate-200/60 px-2.5 py-1 rounded-full animate-none">
                            Middleware Orchestrator
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${useWso2Gateway ? "text-emerald-600" : "text-amber-600"}`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${useWso2Gateway ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-pulse"}`}
                            ></span>
                            <span className="font-mono text-[10px]">
                              {useWso2Gateway ? "WSO2 active" : "Direct active"}
                            </span>
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-800 font-display mb-1.5">
                          Metode Routing API Portal
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          Ubah jalur lalu lintas data portal utama untuk
                          mempelajari pengaruh intermediari middleware WSO2 ESB
                          terhadap response-time real-time.
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                          <input
                            type="checkbox"
                            checked={useWso2Gateway}
                            onChange={(e) => {
                              setUseWso2Gateway(e.target.checked);
                              addEsbLog(
                                `System settings rewritten. WSO2 Carbon Intermediary set ${e.target.checked ? "ENABLED" : "DISABLED"}`,
                              );
                              triggerAlert(
                                "success",
                                `Gateway WSO2 ESB ${e.target.checked ? "Diaktifkan (Rerouting)" : "Dinonaktifkan (Direct API)"}`,
                              );
                            }}
                            className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 mt-0.5"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-700 block select-none font-display">
                              Hubungkan via WSO2 ESB Gateway
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5 leading-normal">
                              {useWso2Gateway
                                ? "Proxy Port 3000 [/wso2/*] dengan header X-Gateway."
                                : "Request langsung [/api/*] bypass ESB."}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* REST Prober Card */}
                    <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] uppercase font-mono font-extrabold tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full animate-none">
                            REST JSON Protocol
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            Direct Endpoint /api
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-800 font-display mb-1.5">
                          Operation: GET /api/courses
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          Menghasilkan daftar rencana studi aktif dengan payload
                          JSON teringkas. Hemat bandwidth karena tidak
                          memerlukan tag dokumen berulang.
                        </p>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        {benchResults.rest ? (
                          <div className="grid grid-cols-2 gap-2 text-center text-xs">
                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="text-[9px] text-slate-400 font-mono block uppercase">
                                SPEED
                              </span>
                              <span className="text-sm font-extrabold text-emerald-600 font-mono">
                                {benchResults.rest.time} ms
                              </span>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="text-[9px] text-slate-400 font-mono block uppercase">
                                SIZE
                              </span>
                              <span className="text-sm font-extrabold text-indigo-600 font-mono">
                                {benchResults.rest.size} Bytes
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 text-center text-[11px] text-slate-400 bg-slate-50 rounded-xl border border-slate-100 font-mono">
                            Belum diuji pada sesi ini.
                          </div>
                        )}

                        <button
                          onClick={() => handleTriggerBenchmark("REST")}
                          disabled={benchmarking}
                          className="w-full text-center py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-200 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span className="font-display">
                            Jalankan Audit REST API
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* SOAP XML Prober Card */}
                    <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] uppercase font-mono font-extrabold tracking-widest bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-1 rounded-full animate-none">
                            SOAP XML Protocol
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            WebService /soap
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-800 font-display mb-1.5">
                          Operation: GetStudentCourses(nim)
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          Menghasilkan daftar rencana studi aktif terbungkus
                          SOAP Envelope tervisualisasi via WSDL Schema Contract
                          yang ketat.
                        </p>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        {benchResults.soap ? (
                          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="text-[9px] text-slate-400 block uppercase font-sans">
                                SPEED
                              </span>
                              <span className="text-sm font-extrabold text-amber-600">
                                {benchResults.soap.time} ms
                              </span>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="text-[9px] text-slate-400 block uppercase font-sans">
                                SIZE
                              </span>
                              <span className="text-sm font-extrabold text-indigo-600">
                                {benchResults.soap.size} Bytes
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 text-center text-[11px] text-slate-400 bg-slate-50 rounded-xl border border-slate-100 font-mono">
                            Belum diuji pada sesi ini.
                          </div>
                        )}

                        <button
                          onClick={() => handleTriggerBenchmark("SOAP")}
                          disabled={benchmarking}
                          className="w-full text-center py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-amber-200 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span className="font-display">
                            Jalankan Audit SOAP XML
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2. Side-by-Side Dual Terminal Consoles (Clean & Professional) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-900 shadow-inner">
                    {/* Simulated Gmail Inbox Simulator for OTP */}
                    <div className="font-mono text-xs text-slate-300 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                          <span className="font-extrabold text-amber-400 flex items-center gap-2 font-display">
                            <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>
                              Simulasi Server Gmail (Penerima OTP 2FA)
                            </span>
                          </span>
                          <span className="text-[9px] text-slate-500 font-sans">
                            Live Listening...
                          </span>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {gmailInbox.length === 0 ? (
                            <div className="text-slate-500 py-8 text-center leading-normal text-[11px] font-sans">
                              Menunggu email berisi kode OTP... <br />
                              Gmail simulator ini aktif saat verifikasi login,
                              penambahan Rencana Kuliah, pembayaran, dll.
                            </div>
                          ) : (
                            gmailInbox.map((mail: any) => {
                              const codeMatch = mail.message.match(/\d{6}/);
                              const codeStr = codeMatch ? codeMatch[0] : null;

                              return (
                                <div
                                  key={mail.id}
                                  className="p-2.5 bg-slate-900/60 rounded border border-slate-800 flex items-start gap-2.5 text-[11px]"
                                >
                                  <div className="bg-slate-800 p-1.5 rounded shrink-0 leading-none">
                                    <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
                                  </div>
                                  <div className="grow leading-normal">
                                    <div className="flex justify-between text-[10px]">
                                      <span className="text-indigo-300 font-bold">
                                        To:{" "}
                                        {mail.email ||
                                          "mahasiswa@esaunggul.ac.id"}
                                      </span>
                                      <span className="text-slate-500">
                                        {new Date(
                                          mail.created_at,
                                        ).toLocaleTimeString()}
                                      </span>
                                    </div>
                                    <h4 className="text-slate-200 font-bold mt-0.5 text-[11px] font-display">
                                      {mail.title}
                                    </h4>
                                    <p className="text-slate-400 text-[10px] mt-0.5 italic">
                                      {mail.message}
                                    </p>

                                    {codeStr && (
                                      <div className="mt-2 flex items-center gap-2">
                                        <span className="bg-indigo-950/80 text-indigo-300 border border-indigo-800 font-bold font-mono tracking-wider px-2 py-0.5 rounded text-[10px]">
                                          {codeStr}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              codeStr,
                                            );
                                            triggerAlert(
                                              "success",
                                              `OTP ${codeStr} disalin!`,
                                            );
                                            addEsbLog(
                                              `Developer: Copied OTP ${codeStr} client-side.`,
                                            );
                                          }}
                                          className="px-1.5 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-[9px] transition-colors cursor-pointer"
                                        >
                                          Salin Kode
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      <div className="text-slate-500 text-[9px] pt-2 border-t border-slate-900/60 mt-3 leading-normal font-sans">
                        Mekanisme bypass SMTP: Karena port mail di-sandboxed
                        default pada Cloud Run, dashboard ini memunculkan
                        salinan surel yang aman demi kelancaran demo.
                      </div>
                    </div>

                    {/* Simulated Unified WSO2 ESB Trace Logger */}
                    <div className="font-mono text-xs text-slate-300 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                          <span className="font-extrabold text-sky-400 flex items-center gap-2 font-display">
                            <Terminal className="w-4 h-4 text-sky-500 shrink-0" />
                            <span>WSO2 Enterprise Service Bus Trace Logs</span>
                          </span>
                          <span className="text-[9px] bg-slate-850 text-indigo-400 px-1.5 py-0.5 rounded font-sans">
                            Carbon v5.3.0
                          </span>
                        </div>

                        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-[10px] leading-relaxed">
                          {esbLogs.length === 0 ? (
                            <div className="text-slate-500 py-8 text-center text-[11px] font-sans">
                              Belum ada log middleware yang dihasilkan.
                              <br />
                              Lakukan pengujian benchmark atau manipulasi data
                              profil untuk memforward log WSO2 Carbon ESB.
                            </div>
                          ) : (
                            esbLogs.map((logStr, idx) => (
                              <div
                                key={idx}
                                className="hover:bg-slate-900 p-0.5 rounded truncate"
                              >
                                <span className="text-slate-500 mr-1">
                                  [{idx}]
                                </span>
                                <span
                                  className={
                                    logStr.includes("Fault") ||
                                    logStr.includes("Failure")
                                      ? "text-rose-400"
                                      : logStr.includes("Proxy OK") ||
                                          logStr.includes("verified")
                                        ? "text-emerald-400"
                                        : "text-sky-300"
                                  }
                                >
                                  {logStr}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="text-slate-500 text-[9px] pt-2 border-t border-slate-900/60 mt-3 leading-normal font-sans">
                        Standard WSO2 Enterprise Header Injection:
                        <br />
                        <span className="text-indigo-400">
                          X-Gateway-Server: WSO2-Carbon-ESB-v5.3.0
                        </span>{" "}
                        |{" "}
                        <span className="text-sky-400">
                          X-Gateway-Processing-Ms
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Comparison graphs from logs */}
                  {performanceHistory.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <h3 className="font-extrabold text-slate-800 text-sm">
                          Hasil Riwayat Grafik Pengujian Komparatif
                        </h3>
                        <button
                          onClick={clearBenchmarkLogs}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg hover:border hover:border-rose-100 font-medium text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Kosongkan Log</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                        {/* Response speed Chart */}
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                          <span className="font-bold text-slate-700 block mb-3 text-center">
                            Kecepatan Response Time (ms) - Lebih Rendah Lebih
                            Baik
                          </span>
                          <div className="h-52 w-full">
                            <ResponsiveContainer
                              width="100%"
                              height="100%"
                              minWidth={0}
                              minHeight={0}
                            >
                              <BarChart data={performanceHistory.slice(-10)}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                  stroke="#e2e8f0"
                                />
                                <XAxis dataKey="created" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Legend />
                                <Bar
                                  dataKey="time"
                                  name="Time (ms)"
                                  fill="#38bdf8"
                                >
                                  {performanceHistory
                                    .slice(-10)
                                    .map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={
                                          entry.api_type === "REST"
                                            ? "#10b981"
                                            : "#f59e0b"
                                        }
                                      />
                                    ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Payload size chart */}
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                          <span className="font-bold text-slate-700 block mb-3 text-center">
                            Ukuran Payload Transaksi (Bytes) - Lebih Rendah
                            Lebih Efisien
                          </span>
                          <div className="h-52 w-full">
                            <ResponsiveContainer
                              width="100%"
                              height="100%"
                              minWidth={0}
                              minHeight={0}
                            >
                              <BarChart data={performanceHistory.slice(-10)}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                  stroke="#e2e8f0"
                                />
                                <XAxis dataKey="created" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Legend />
                                <Bar
                                  dataKey="size"
                                  name="Payload (Bytes)"
                                  fill="#6366f1"
                                >
                                  {performanceHistory
                                    .slice(-10)
                                    .map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={
                                          entry.api_type === "REST"
                                            ? "#10b981"
                                            : "#f59e0b"
                                        }
                                      />
                                    ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Automated analysis conclusion box */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        <span className="font-bold text-slate-800 block mb-1.5 uppercase font-mono text-[10px] tracking-wider">
                          Kesimpulan Otomatis Sistem Benchmark:
                        </span>
                        {getAutoConclusion()}
                      </div>
                    </div>
                  )}

                  {/* Raw Envelope/JSON Inspect Panel block */}
                  {(benchResults.rest || benchResults.soap) && (
                    <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-xs font-mono text-xs">
                      <span className="inline-block text-[10px] bg-slate-800 uppercase font-bold tracking-widest text-slate-400 py-0.5 px-2 rounded mb-3">
                        Payload Inspector Console
                      </span>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {benchResults.rest && (
                          <div className="space-y-2">
                            <span className="text-emerald-400 block text-xs">
                              REST JSON Response:
                            </span>
                            <pre className="p-3 bg-slate-950 rounded-xl overflow-x-auto max-h-60 text-[11px] leading-relaxed text-slate-300">
                              {benchResults.rest.raw}
                            </pre>
                          </div>
                        )}

                        {benchResults.soap && (
                          <div className="space-y-2">
                            <span className="text-amber-400 block text-xs">
                              SOAP XML Response:
                            </span>
                            <pre className="p-3 bg-slate-950 rounded-xl overflow-x-auto max-h-60 text-[11px] leading-relaxed text-slate-300">
                              {benchResults.soap.raw}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* HIGHLY REALISTIC API SECURITY COMPARISON PLAYGROUND */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="border-b border-slate-100 pb-5">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-rose-50 border border-rose-100 rounded-xl text-rose-600">
                          <Lock className="w-5 h-5 shrink-0" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-800 font-display">
                            Pusat Audit Keamanan & Proteksi API
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed mt-1">
                            Bandingkan ketahanan SIAKAD ESA UNGGUL terhadap
                            ancaman keamanan siber ketika diakses secara
                            langsung vs dilindungi oleh Gateway WSO2 API
                            Manager.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Step 1: Select Attack Vector */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Attack selectors */}
                      <div className="lg:col-span-5 space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Pilih Vektor Serangan Keamanan Siber:
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {[
                            {
                              key: "DDOS",
                              title: "DDoS & Connection Flood",
                              desc: "Spamming ribuan request per detik untuk membanjiri kolam koneksi database SIAKAD.",
                              icon: Activity,
                              badge: "Rate Limiting Protection",
                              bgColor: "from-red-50 to-red-50/30",
                            },
                            {
                              key: "SQLI",
                              title: "SQL Injection Extract",
                              desc: "Menyisipkan parameter `' OR '1'='1' --` ke input NIM untuk mencuri seluruh data profil mahasiswa.",
                              icon: FileText,
                              badge: "SQL Injection Threat Protect",
                              bgColor: "from-orange-50 to-orange-50/30",
                            },
                            {
                              key: "BYPASS",
                              title: "Expired JWT Token Bypass",
                              desc: "Mengakses endpoint statistik keuangan sensitif menggunakan token otorisasi yang sudah kedaluwarsa.",
                              icon: User,
                              badge: "Unified JWT Validation",
                              bgColor: "from-amber-50 to-amber-50/30",
                            },
                            {
                              key: "XMLBOMB",
                              title: "XML Entity Expansion",
                              desc: "Billion Laughs attack: Mengirim entitas XML bersarang untuk membekukan RAM server SOAP Node.",
                              icon: Cpu,
                              badge: "XML Threat Protection",
                              bgColor: "from-purple-50 to-purple-50/30",
                            },
                          ].map((item) => {
                            const ItemIcon = item.icon;
                            const isSelected = selectedAttack === item.key;
                            return (
                              <button
                                key={item.key}
                                onClick={() => {
                                  setSelectedAttack(item.key);
                                  setSecuritySimResult(null);
                                }}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                                  isSelected
                                    ? `bg-gradient-to-r ${item.bgColor} border-indigo-300 shadow-md ring-1 ring-indigo-200`
                                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`p-2 rounded-lg shrink-0 transition-all ${
                                      isSelected
                                        ? "bg-indigo-100 text-indigo-700"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    <ItemIcon className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                      <span
                                        className={`font-bold text-sm font-display ${isSelected ? "text-indigo-900" : "text-slate-800"}`}
                                      >
                                        {item.title}
                                      </span>
                                      <span
                                        className={`text-[9px] font-mono tracking-wide px-2 py-0.5 rounded-md font-semibold ${
                                          isSelected
                                            ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                            : "bg-slate-100 text-slate-500"
                                        }`}
                                      >
                                        {item.badge}
                                      </span>
                                    </div>
                                    <p
                                      className={`text-[11px] leading-relaxed mt-1 font-sans ${isSelected ? "text-slate-700" : "text-slate-500"}`}
                                    >
                                      {item.desc}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Playground Arena */}
                      <div className="lg:col-span-7 space-y-5">
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Arsitektur Jalur Aliran & Logika Perlindungan:
                            </span>
                          </div>

                          {/* Attack Details Card */}
                          <div className="p-4 bg-gradient-to-r from-red-50 to-red-50/30 border border-red-100 rounded-xl mb-5">
                            <div className="flex items-center gap-2 text-red-800 font-bold font-display text-xs">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span>Payload Simulasi Serangan:</span>
                            </div>
                            <pre className="mt-2 p-3 bg-slate-950 text-red-400 rounded-lg font-mono text-[10px] overflow-x-auto select-all border border-slate-800 leading-relaxed">
                              {selectedAttack === "DDOS" &&
                                "HTTP GET /api/courses/list (Volume: 5.000 req/sec from IP 198.51.100.41)"}
                              {selectedAttack === "SQLI" &&
                                "HTTP POST /api/student/profile | Body: { nim: \"' OR '1'='1' --\" }"}
                              {selectedAttack === "BYPASS" &&
                                "HTTP GET /api/admin/financial-stats | Header: { Authorization: 'Bearer expired_token_sniffed_123' }"}
                              {selectedAttack === "XMLBOMB" &&
                                `SOAP POST /soap/courses | Body:\n<!DOCTYPE lolz [ <!ENTITY lol "lol"> <!ENTITY lol1 "&lol;&lol;&lol;..."> ]>\n<soapenv:Envelope>...&lol1;...</soapenv:Envelope>`}
                            </pre>
                          </div>

                          {/* Dual comparative triggers */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            <button
                              onClick={() =>
                                handleTriggerSecuritySimulation(
                                  selectedAttack,
                                  false,
                                )
                              }
                              disabled={simulatingSecurity}
                              className="w-full py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 border border-slate-600 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <div className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></div>
                              <span>Serang via Direct Core API</span>
                            </button>

                            <button
                              onClick={() =>
                                handleTriggerSecuritySimulation(
                                  selectedAttack,
                                  true,
                                )
                              }
                              disabled={simulatingSecurity}
                              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 border border-indigo-500 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ShieldCheck className="w-4 h-4 text-emerald-300" />
                              <span>Serang via WSO2 Gateway</span>
                            </button>
                          </div>

                          {/* Visualization Route Schema */}
                          <div className="border border-slate-200 rounded-xl bg-white p-4">
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                Diagram Komparasi Aliran Data:
                              </span>
                            </div>

                            <div className="flex flex-col gap-4">
                              {/* Direct route schema */}
                              <div className="p-4 border border-red-200 bg-gradient-to-br from-red-50/50 to-red-50/20 rounded-xl space-y-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-sm text-red-700 block font-display">
                                      Direct Route (Tanpa WSO2 Gateway)
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 leading-relaxed">
                                    Koneksi publik langsung terakses ke web
                                    server utama SIAKAD Esa Unggul tanpa sensor
                                    atau mitigasi perimeter.
                                  </p>
                                </div>
                                <div className="py-3 flex flex-wrap items-center justify-center gap-1.5 font-mono text-[10px] bg-red-100/40 rounded-lg border border-red-100/50 px-3">
                                  <span className="font-semibold text-slate-700 bg-white/60 px-2 py-1 rounded">
                                    Attacker
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-red-400 shrink-0" />
                                  <span className="font-bold text-red-800 bg-white/60 px-2 py-1 rounded">
                                    Web App Core
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-red-400 shrink-0" />
                                  <span className="text-red-600 font-bold bg-red-100 px-2 py-1 rounded">
                                    Exposed / Crash!
                                  </span>
                                </div>
                              </div>

                              {/* WSO2 gateway route schema */}
                              <div className="p-4 border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-indigo-50/20 rounded-xl space-y-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-sm text-indigo-700 block font-display">
                                      Protected Route (Dilindungi WSO2)
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 leading-relaxed">
                                    Request dicegat di batas perimeter oleh WSO2
                                    Gateway. Diperiksa kebijakannya secara ketat
                                    sebelum diteruskan ke backend.
                                  </p>
                                </div>
                                <div className="py-3 flex flex-wrap items-center justify-center gap-1.5 font-mono text-[10px] bg-slate-900 rounded-lg border border-slate-800 px-3">
                                  <span className="text-indigo-300 bg-slate-800 px-2 py-1 rounded">
                                    Attacker
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0" />
                                  <span className="font-bold text-sky-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                                    WSO2 Gateway
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0" />
                                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-1 rounded border border-emerald-900">
                                    Safe / Blocked
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Results console - Display real outcomes of simulation */}
                    {securitySimResult && (
                      <div className="pt-5 border-t border-slate-200 text-xs space-y-5">
                        {/* Status Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 font-mono text-[11px]">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400">
                              HTTP OUTCOME STATUS:
                            </span>
                            <span
                              className={`font-bold px-2.5 py-1 rounded-md text-xs ${
                                securitySimResult.httpStatus >= 400
                                  ? "bg-red-950/80 text-red-400 border border-red-800"
                                  : "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                              }`}
                            >
                              {securitySimResult.httpStatus}{" "}
                              {securitySimResult.httpStatus === 200
                                ? "OK/Exploited"
                                : securitySimResult.httpStatus === 429
                                  ? "Too Many Requests"
                                  : securitySimResult.httpStatus === 403
                                    ? "Forbidden / Pattern Matched"
                                    : securitySimResult.httpStatus === 401
                                      ? "Unauthorized / Bad JWT"
                                      : "Service Unavailable/Crashed"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">ROUTING VIA:</span>
                            <span
                              className={`font-bold uppercase text-xs px-2 py-0.5 rounded ${securitySimResult.useWso2 ? "text-indigo-400 bg-indigo-950/50" : "text-rose-400 bg-rose-950/50"}`}
                            >
                              {securitySimResult.useWso2
                                ? "WSO2 API Gateway"
                                : "Direct Server Endpoint"}
                            </span>
                          </div>
                        </div>

                        {/* Interactive columns: JSON Result vs WSO2 policy XML */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          {/* Live Payload Stream JSON */}
                          <div className="lg:col-span-5 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                {securitySimResult.useWso2
                                  ? "WSO2 Gateway Payload Response:"
                                  : "Direct API Leak / Payload Response:"}
                              </span>
                            </div>
                            <pre
                              className={`p-4 rounded-xl font-mono text-[10px] overflow-x-auto max-h-80 leading-relaxed border ${
                                securitySimResult.useWso2
                                  ? "bg-slate-950 text-indigo-300 border-slate-700"
                                  : "bg-slate-950 text-amber-400 border-red-800"
                              }`}
                            >
                              {JSON.stringify(
                                securitySimResult.responseData,
                                null,
                                2,
                              )}
                            </pre>
                            <div className="text-[10px] text-slate-400 leading-relaxed italic">
                              {securitySimResult.useWso2
                                ? "WSO2 Gateway melempar kesalahan standar (Fault XML/JSON) tanpa membebani thread database server SIAKAD."
                                : "Hacker sukses mengekstrak informasi rahasia atau melumpuhkan server karena ketiadaan filter border."}
                            </div>
                          </div>

                          {/* Log tracer output */}
                          <div className="lg:col-span-7 space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                  Trace Audit Log Real-time:
                                </span>
                              </div>
                              <div className="p-3 bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl font-mono text-[10px] space-y-1.5 min-h-[120px] max-h-48 overflow-y-auto">
                                {securitySimResult.traceLogs.map(
                                  (logStr, idx) => (
                                    <div key={idx} className="leading-relaxed">
                                      <span className="text-slate-600 mr-2">
                                        ››
                                      </span>
                                      <span className="text-slate-300">
                                        {logStr}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>

                            {/* WSO2 Policy Highlight Box */}
                            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                                    Konfigurasi Kebijakan WSO2 ESB:
                                  </span>
                                </div>
                                <span className="text-[8px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded uppercase font-semibold">
                                  Mediator Synapse Config
                                </span>
                              </div>
                              <pre className="p-3 bg-slate-900 leading-relaxed text-slate-300 font-mono text-[9px] overflow-x-auto max-h-48 rounded-lg select-all border border-slate-800">
                                {securitySimResult.wso2PolicyXml}
                              </pre>
                              <div className="text-[10px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800">
                                <span className="font-semibold text-slate-300">
                                  Langkah Mitigasi:
                                </span>{" "}
                                {securitySimResult.mitigationStep}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ==========================================================
          C. FLOATING DEVELOPER UTILITY DRAWER (COMPACT & NON-INTRUSIVE)
          ========================================================== */}
      {showDevPanel && (
        <div
          id="siakad-developer-console"
          className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col font-mono text-xs transition-all duration-300 animate-in slide-in-from-bottom-5"
        >
          {/* Header Bar */}
          <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5 font-sans">
              <Terminal className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Developer Live Stream</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDevStreamExpanded(!isDevStreamExpanded)}
                className="p-1 hover:bg-slate-800/80 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={
                  isDevStreamExpanded ? "Minimalkan Panel" : "Maksimalkan Panel"
                }
              >
                {isDevStreamExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setShowDevPanel(false)}
                className="p-1 hover:bg-slate-800/80 rounded text-slate-400 hover:text-rose-455 transition-colors cursor-pointer"
                title="Sembunyikan Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conditional Content Panel based on expansion */}
          {isDevStreamExpanded && (
            <div className="flex flex-col max-h-96 min-h-64 divide-y divide-slate-900 bg-slate-950">
              {/* Inbox stream simulator section */}
              <div className="p-3.5 flex flex-col min-h-[140px] max-h-48 overflow-hidden">
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-900">
                  <span className="font-extrabold text-amber-400 flex items-center gap-1.5 font-sans text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-amber-500" />
                    <span>Live OTP Mail Simulator</span>
                  </span>
                  <span className="text-[8px] text-slate-500 font-sans">
                    Server listening...
                  </span>
                </div>

                <div className="grow overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {gmailInbox.length === 0 ? (
                    <div className="text-slate-600 py-6 text-center text-[10px] leading-relaxed font-sans">
                      Menunggu pemicuan OTP 2-Langkah...
                    </div>
                  ) : (
                    gmailInbox.map((mail: any) => {
                      const codeMatch = mail.message.match(/\d{6}/);
                      const codeStr = codeMatch ? codeMatch[0] : null;

                      return (
                        <div
                          key={mail.id}
                          className="p-2 bg-slate-900 border border-slate-800/60 rounded flex items-start gap-2.5 text-[10px]"
                        >
                          <div className="bg-slate-850 p-1 rounded shrink-0 mt-0.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                          </div>
                          <div className="grow leading-relaxed">
                            <div className="flex justify-between text-[8px] text-slate-500">
                              <span>
                                To: {mail.email || "mahasiswa@esaunggul.ac.id"}
                              </span>
                              <span>
                                {new Date(mail.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                            <h5 className="text-slate-200 font-bold font-sans mt-0.5 text-[10px]">
                              {mail.title}
                            </h5>
                            <p className="text-slate-400 italic text-[9px] mt-0.5">
                              {mail.message}
                            </p>

                            {/* Fast Copy-paste OTP button */}
                            {codeStr && (
                              <div className="mt-1.5 flex items-center gap-1.5">
                                <span className="bg-indigo-950 text-indigo-300 font-bold border border-indigo-900/60 tracking-normal px-1.5 py-0.2 rounded text-[9px] font-mono">
                                  {codeStr}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(codeStr);
                                    setOtpForm(codeStr);
                                    triggerAlert(
                                      "success",
                                      `OTP ${codeStr} disalin & diisi!`,
                                    );
                                    addEsbLog(
                                      `Developer: Copied OTP ${codeStr} client-side.`,
                                    );
                                  }}
                                  className="px-1.5 py-0.2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-[8px] transition-colors cursor-pointer"
                                  title="Salin Kode OTP ke clipboard"
                                >
                                  Salin & Isi
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Logger stream simulator section */}
              <div className="p-3.5 flex flex-col min-h-[140px] max-h-48 overflow-hidden">
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-900">
                  <span className="font-extrabold text-sky-400 flex items-center gap-1.5 font-sans text-[11px]">
                    <Terminal className="w-3.5 h-3.5 text-sky-500" />
                    <span>WSO2 Carbon Router Trace</span>
                  </span>
                  <span className="text-[8px] text-slate-500 font-sans">
                    Active Router Logs
                  </span>
                </div>

                <div className="grow overflow-y-auto space-y-1 pr-1 text-[9px] leading-relaxed font-mono custom-scrollbar">
                  {esbLogs.length === 0 ? (
                    <div className="text-slate-600 py-6 text-center text-[10px] font-sans">
                      Menunggu integrasi request API...
                    </div>
                  ) : (
                    esbLogs.map((logStr, idx) => (
                      <div
                        key={idx}
                        className="hover:bg-slate-900 p-0.5 rounded truncate"
                      >
                        <span className="text-slate-500 mr-1">[{idx}]</span>
                        <span
                          className={
                            logStr.includes("Fault") ||
                            logStr.includes("Failure")
                              ? "text-rose-400"
                              : logStr.includes("Proxy OK") ||
                                  logStr.includes("verified")
                                ? "text-emerald-400"
                                : "text-indigo-400"
                          }
                        >
                          {logStr}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer of the panel */}
          <div className="bg-slate-900 px-3.5 py-1.5 border-t border-slate-800 text-[8px] text-slate-500 flex justify-between shrink-0 font-sans">
            <span>Server Proxy: Port 3000</span>
            <span className="text-amber-500 font-mono">
              X-WSO2-Header Injection Active
            </span>
          </div>
        </div>
      )}

      {/* Bottom Footer Credits branding (Official & Professional Layout) */}
      <footer
        id="siakad-footer-panel"
        className="bg-slate-100 border-t border-slate-200 text-slate-500 text-xs py-6 shrink-0 font-display"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-700">
              Sistem Informasi Akademik (SIAKAD) Online
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Portal Integrasi & Benchmark Middleware Layanan Keimigrasian &
              Rencana Studi Mahasiswa
            </p>
          </div>
          <div className="text-[10px] text-slate-400 text-right">
            <p>Universitas Esa Unggul - Fakultas Ilmu Komputer</p>
            <p className="mt-0.5">
              &copy; 2026 Kelompok 9. All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
