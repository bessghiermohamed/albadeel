import { Subject } from "./types";

export const subjectsData: Subject[] = [
  // ===== السداسي الأول =====
  {
    id: "s1-01",
    nameAr: "أصول التربية الإسلامية",
    nameEn: "Foundations of Islamic Education",
    code: "PEP-S1-01",
    semester: 1,
    isShared: false,
    category: "تربوية",
    description:
      "دراسة أصول ومبادئ التربية في الإسلام، وتأثيرها على المنظومة التربوية المعاصرة",
    driveLink: "#",
    icon: "BookOpen",
    color: "#DC2626",
    order: 1,
  },
  {
    id: "s1-02",
    nameAr: "علم النفس العام",
    nameEn: "General Psychology",
    code: "PEP-S1-02",
    semester: 1,
    isShared: false,
    category: "نفسية",
    description:
      "مقدمة في علم النفس العام ودراسة السلوك الإنساني والعمليات العقلية الأساسية",
    driveLink: "#",
    icon: "Brain",
    color: "#7C3AED",
    order: 2,
  },
  {
    id: "s1-03",
    nameAr: "المدخل إلى علوم التربية",
    nameEn: "Introduction to Educational Sciences",
    code: "PEP-S1-03",
    semester: 1,
    isShared: false,
    category: "تربوية",
    description:
      "تعريف بعلم التربية ومجالاته ونظرياته الأساسية وتطوره عبر العصور",
    driveLink: "#",
    icon: "GraduationCap",
    color: "#D97706",
    order: 3,
  },
  {
    id: "s1-04",
    nameAr: "اللغة العربية ١",
    nameEn: "Arabic Language 1",
    code: "PEP-S1-04",
    semester: 1,
    isShared: false,
    category: "لغوية",
    description:
      "دراسة قواعد النحو والصرف ومستويات اللغة العربية وتطبيقاتها العملية",
    driveLink: "#",
    icon: "PenTool",
    color: "#059669",
    order: 4,
  },
  {
    id: "s1-05",
    nameAr: "علم الاجتماع التربوي",
    nameEn: "Educational Sociology",
    code: "PEP-S1-05",
    semester: 1,
    isShared: false,
    category: "اجتماعية",
    description:
      "دراسة العلاقة بين المجتمع والتربية وأثر المؤسسات الاجتماعية في العملية التربوية",
    driveLink: "#",
    icon: "Users",
    color: "#2563EB",
    order: 5,
  },
  {
    id: "s1-06",
    nameAr: "تكنولوجيا الإعلام والاتصال",
    nameEn: "Information & Communication Technology",
    code: "PEP-S1-06",
    semester: 1,
    isShared: false,
    category: "تكنولوجية",
    description:
      "استخدام التكنولوجيا الحديثة في العملية التعليمية وتوظيف وسائل الإعلام والاتصال",
    driveLink: "#",
    icon: "Monitor",
    color: "#0891B2",
    order: 6,
  },
  {
    id: "s1-07",
    nameAr: "تطور الفكر التربوي",
    nameEn: "Evolution of Educational Thought",
    code: "PEP-S1-07",
    semester: 1,
    isShared: false,
    category: "تربوية",
    description:
      "تتبع تطور الفكر التربوي عبر الحضارات المختلفة من القديم إلى المعاصر",
    driveLink: "#",
    icon: "History",
    color: "#B45309",
    order: 7,
  },
  {
    id: "s1-08",
    nameAr: "مناهج البحث التربوي",
    nameEn: "Educational Research Methods",
    code: "PEP-S1-08",
    semester: 1,
    isShared: false,
    category: "منهجية",
    description:
      "دراسة مناهج البحث العلمي في المجال التربوي وأساليب جمع وتحليل البيانات",
    driveLink: "#",
    icon: "Search",
    color: "#4F46E5",
    order: 8,
  },
  {
    id: "s1-09",
    nameAr: "التربية المقارنة",
    nameEn: "Comparative Education",
    code: "PEP-S1-09",
    semester: 1,
    isShared: false,
    category: "تربوية",
    description:
      "دراسة مقارنة للأنظمة التربوية في مختلف الدول واستخلاص الدروس والعبر",
    driveLink: "#",
    icon: "Globe",
    color: "#0D9488",
    order: 9,
  },
  {
    id: "s1-10",
    nameAr: "الإحصاء التربوي",
    nameEn: "Educational Statistics",
    code: "PEP-S1-10",
    semester: 1,
    isShared: true,
    category: "منهجية",
    description:
      "أساسيات الإحصاء وتطبيقاته في المجال التربوي وتحليل البيانات التربوية",
    driveLink: "#",
    icon: "BarChart3",
    color: "#6D28D9",
    order: 10,
  },
  {
    id: "s1-11",
    nameAr: "اللغة الفرنسية ١",
    nameEn: "French Language 1",
    code: "PEP-S1-11",
    semester: 1,
    isShared: true,
    category: "لغوية",
    description:
      "تعلم أساسيات اللغة الفرنسية ومهارات التواصل والقراءة والكتابة",
    driveLink: "#",
    icon: "Languages",
    color: "#1D4ED8",
    order: 11,
  },
  {
    id: "s1-12",
    nameAr: "اللغة الإنجليزية ١",
    nameEn: "English Language 1",
    code: "PEP-S1-12",
    semester: 1,
    isShared: true,
    category: "لغوية",
    description:
      "تعلم أساسيات اللغة الإنجليزية ومهارات التواصل والاستماع والقراءة",
    driveLink: "#",
    icon: "MessageSquare",
    color: "#BE185D",
    order: 12,
  },

  // ===== السداسي الثاني =====
  {
    id: "s2-01",
    nameAr: "علم النفس التربوي",
    nameEn: "Educational Psychology",
    code: "PEP-S2-01",
    semester: 2,
    isShared: false,
    category: "نفسية",
    description:
      "دراسة نظريات التعلم والنمو المعرفي ودور الدوافع والانفعالات في العملية التعليمية",
    driveLink: "#",
    icon: "Brain",
    color: "#7C3AED",
    order: 1,
  },
  {
    id: "s2-02",
    nameAr: "طرق التدريس العامة",
    nameEn: "General Teaching Methods",
    code: "PEP-S2-02",
    semester: 2,
    isShared: false,
    category: "تربوية",
    description:
      "استعراض طرق التدريس المختلفة وتطبيقاتها العملية في المواقف التعليمية",
    driveLink: "#",
    icon: "Presentation",
    color: "#DC2626",
    order: 2,
  },
  {
    id: "s2-03",
    nameAr: "اللغة العربية ٢",
    nameEn: "Arabic Language 2",
    code: "PEP-S2-03",
    semester: 2,
    isShared: false,
    category: "لغوية",
    description:
      "تعميق دراسة اللغة العربية: البلاغة والأدب وتحليل النصوص الأدبية",
    driveLink: "#",
    icon: "PenTool",
    color: "#059669",
    order: 3,
  },
  {
    id: "s2-04",
    nameAr: "التربية العملية ١",
    nameEn: "Practical Education 1",
    code: "PEP-S2-04",
    semester: 2,
    isShared: false,
    category: "تطبيقية",
    description:
      "التطبيق العملي للمفاهيم التربوية في بيئة مدرسية حقيقية تحت إشراف أساتذة",
    driveLink: "#",
    icon: "School",
    color: "#D97706",
    order: 4,
  },
  {
    id: "s2-05",
    nameAr: "المناهج والمقررات الدراسية",
    nameEn: "Curricula & Syllabi",
    code: "PEP-S2-05",
    semester: 2,
    isShared: false,
    category: "تربوية",
    description:
      "دراسة أسس بناء المناهج وتصميم المقررات وتقويمها وتطويرها",
    driveLink: "#",
    icon: "BookMarked",
    color: "#B45309",
    order: 5,
  },
  {
    id: "s2-06",
    nameAr: "القياس والتقويم التربوي",
    nameEn: "Educational Measurement & Evaluation",
    code: "PEP-S2-06",
    semester: 2,
    isShared: false,
    category: "منهجية",
    description:
      "أسس بناء الاختبارات وأساليب القياس والتقويم في العملية التعليمية",
    driveLink: "#",
    icon: "Target",
    color: "#4F46E5",
    order: 6,
  },
  {
    id: "s2-07",
    nameAr: "التربية الخاصة",
    nameEn: "Special Education",
    code: "PEP-S2-07",
    semester: 2,
    isShared: false,
    category: "تربوية",
    description:
      "دراسة ذوي الاحتياجات الخاصة وسبل دمجهم في المنظومة التربوية",
    driveLink: "#",
    icon: "Heart",
    color: "#E11D48",
    order: 7,
  },
  {
    id: "s2-08",
    nameAr: "إدارة الصف",
    nameEn: "Classroom Management",
    code: "PEP-S2-08",
    semester: 2,
    isShared: false,
    category: "تربوية",
    description:
      "استراتيجيات إدارة الصف الدراسي والتعامل مع سلوكيات التلاميذ وتنظيم البيئة التعليمية",
    driveLink: "#",
    icon: "Layout",
    color: "#0891B2",
    order: 8,
  },
  {
    id: "s2-09",
    nameAr: "تاريخ التربية",
    nameEn: "History of Education",
    code: "PEP-S2-09",
    semester: 2,
    isShared: false,
    category: "تربوية",
    description:
      "دراسة تطور الأنظمة التربوية عبر التاريخ من الحضارات القديمة إلى العصر الحديث",
    driveLink: "#",
    icon: "Clock",
    color: "#0D9488",
    order: 9,
  },
  {
    id: "s2-10",
    nameAr: "الإحصاء التربوي ٢",
    nameEn: "Educational Statistics 2",
    code: "PEP-S2-10",
    semester: 2,
    isShared: true,
    category: "منهجية",
    description:
      "تعميق دراسة الإحصاء التربوي والتحليل المتقدم للبيانات التربوية",
    driveLink: "#",
    icon: "BarChart3",
    color: "#6D28D9",
    order: 10,
  },
  {
    id: "s2-11",
    nameAr: "اللغة الفرنسية ٢",
    nameEn: "French Language 2",
    code: "PEP-S2-11",
    semester: 2,
    isShared: true,
    category: "لغوية",
    description:
      "تعميق مهارات اللغة الفرنسية: الكتابة الأكاديمية والتعبير الكتابي والشفهي",
    driveLink: "#",
    icon: "Languages",
    color: "#1D4ED8",
    order: 11,
  },
  {
    id: "s2-12",
    nameAr: "اللغة الإنجليزية ٢",
    nameEn: "English Language 2",
    code: "PEP-S2-12",
    semester: 2,
    isShared: true,
    category: "لغوية",
    description:
      "تعميق مهارات اللغة الإنجليزية: المحادثة والكتابة الأكاديمية وفهم المقروء",
    driveLink: "#",
    icon: "MessageSquare",
    color: "#BE185D",
    order: 12,
  },
];

export const categories = [
  { id: "تربوية", label: "تربوية", color: "#DC2626", icon: "GraduationCap" },
  { id: "نفسية", label: "نفسية", color: "#7C3AED", icon: "Brain" },
  { id: "لغوية", label: "لغوية", color: "#059669", icon: "PenTool" },
  { id: "اجتماعية", label: "اجتماعية", color: "#2563EB", icon: "Users" },
  { id: "تكنولوجية", label: "تكنولوجية", color: "#0891B2", icon: "Monitor" },
  { id: "منهجية", label: "منهجية", color: "#4F46E5", icon: "Search" },
  { id: "تطبيقية", label: "تطبيقية", color: "#D97706", icon: "School" },
];

export function getSubjectById(id: string): Subject | undefined {
  return subjectsData.find((s) => s.id === id);
}

export function getSubjectsBySemester(semester: 1 | 2): Subject[] {
  return subjectsData
    .filter((s) => s.semester === semester)
    .sort((a, b) => a.order - b.order);
}

export function getSharedSubjects(): Subject[] {
  return subjectsData.filter((s) => s.isShared);
}

export function getSubjectsByCategory(category: string): Subject[] {
  return subjectsData.filter((s) => s.category === category);
}

export function searchSubjects(query: string): Subject[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  return subjectsData.filter(
    (s) =>
      s.nameAr.includes(lowerQuery) ||
      s.nameEn?.toLowerCase().includes(lowerQuery) ||
      s.code.toLowerCase().includes(lowerQuery) ||
      s.category.includes(lowerQuery) ||
      s.description?.includes(lowerQuery)
  );
}
