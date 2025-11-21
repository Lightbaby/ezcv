import { ResumeData, Profile, Skill, Experience, Project, Education, Language, TabView } from './types';

const PROFILE_EN: Profile = {
  name: "ALEX_DEV_01",
  title: "Senior Frontend Architect",
  level: 8,
  bio: "Specialized in building immersive, high-performance web interfaces. Obsessed with micro-interactions and clean architecture.",
  contact: {
    email: "alex@example.com",
    github: "github.com/alexdev",
    linkedin: "linkedin.com/in/alexdev",
    location: "San Francisco, CA"
  },
  stats: {
    intelligence: 90,
    creativity: 85,
    endurance: 75,
    charisma: 60,
    agility: 95,
    luck: 40
  }
};

const PROFILE_ZH: Profile = {
  name: "ALEX_DEV_01",
  title: "高级前端架构师",
  level: 8,
  bio: "专注于构建沉浸式、高性能的Web界面。痴迷于微交互和整洁的架构设计。",
  contact: {
    email: "alex@example.com",
    github: "github.com/alexdev",
    linkedin: "linkedin.com/in/alexdev",
    location: "上海, 中国"
  },
  stats: {
    intelligence: 90,
    creativity: 85,
    endurance: 75,
    charisma: 60,
    agility: 95,
    luck: 40
  }
};

const SKILLS: Skill[] = [
  { name: "React / Next.js", level: 95, category: "frontend" },
  { name: "TypeScript", level: 90, category: "frontend" },
  { name: "Three.js / WebGL", level: 75, category: "design" },
  { name: "Node.js", level: 80, category: "backend" },
  { name: "Tailwind CSS", level: 95, category: "design" },
  { name: "Docker / CI/CD", level: 70, category: "tools" }
];

const EXPERIENCE_EN: Experience[] = [
  {
    id: "exp-1",
    role: "Senior Frontend Engineer",
    company: "CyberTech Solutions",
    period: "2021 - Present",
    year: 2021,
    description: "Leading the frontend team in rebuilding the core SaaS platform using Next.js and WebGL.",
    achievements: [
      "Improved core web vitals by 40%",
      "Architected a micro-frontend system",
      "Mentored 5 junior developers"
    ],
    techStack: ["React", "TypeScript", "GraphQL", "AWS"]
  },
  {
    id: "exp-2",
    role: "Frontend Developer",
    company: "NeoSystems",
    period: "2018 - 2021",
    year: 2018,
    description: "Developed responsive dashboards for fintech clients.",
    achievements: [
      "Built a real-time data visualization engine",
      "Reduced build times by 50%"
    ],
    techStack: ["Vue.js", "D3.js", "Firebase"]
  }
];

const EXPERIENCE_ZH: Experience[] = [
  {
    id: "exp-1",
    role: "高级前端工程师",
    company: "赛博科技解决方案",
    period: "2021 - 至今",
    year: 2021,
    description: "带领前端团队使用 Next.js 和 WebGL 重构核心 SaaS 平台。",
    achievements: [
      "核心 Web 指标提升 40%",
      "架构微前端系统",
      "指导 5 名初级开发人员"
    ],
    techStack: ["React", "TypeScript", "GraphQL", "AWS"]
  },
  {
    id: "exp-2",
    role: "前端开发工程师",
    company: "新系统科技",
    period: "2018 - 2021",
    year: 2018,
    description: "为金融科技客户开发响应式仪表板。",
    achievements: [
      "构建实时数据可视化引擎",
      "构建时间减少 50%"
    ],
    techStack: ["Vue.js", "D3.js", "Firebase"]
  }
];

const EDUCATION_EN: Education[] = [
  {
    id: "edu-1",
    school: "Tech University of Future",
    degree: "B.S. Computer Science",
    year: 2018,
    period: "2014 - 2018",
    description: "Focus on Artificial Intelligence and Human-Computer Interaction. Graduated Cum Laude."
  }
];

const EDUCATION_ZH: Education[] = [
  {
    id: "edu-1",
    school: "未来科技大学",
    degree: "计算机科学学士",
    year: 2018,
    period: "2014 - 2018",
    description: "主修人工智能与人机交互。优等毕业生。"
  }
];

const PROJECTS_EN: Project[] = [
  {
    id: "proj-1",
    name: "Neon Dashboard",
    description: "A high-performance admin dashboard with cyberpunk aesthetics.",
    tech: ["React", "Tailwind", "Vite"]
  },
  {
    id: "proj-2",
    name: "AI Chat Interface",
    description: "Real-time chat interface using Gemini API.",
    tech: ["Next.js", "AI SDK", "WebSocket"]
  }
];

const PROJECTS_ZH: Project[] = [
  {
    id: "proj-1",
    name: "霓虹仪表盘",
    description: "具有赛博朋克美学的高性能管理仪表盘。",
    tech: ["React", "Tailwind", "Vite"]
  },
  {
    id: "proj-2",
    name: "AI 聊天界面",
    description: "使用 Gemini API 的实时聊天界面。",
    tech: ["Next.js", "AI SDK", "WebSocket"]
  }
];

export const getInitialData = (lang: Language): ResumeData => ({
  profile: lang === 'en' ? PROFILE_EN : PROFILE_ZH,
  skills: SKILLS,
  experience: lang === 'en' ? EXPERIENCE_EN : EXPERIENCE_ZH,
  education: lang === 'en' ? EDUCATION_EN : EDUCATION_ZH,
  projects: lang === 'en' ? PROJECTS_EN : PROJECTS_ZH,
  config: {
    modules: [TabView.STATS, TabView.TIMELINE, TabView.EDUCATION, TabView.PROJECTS],
    hiddenModules: []
  }
});

export const UI_LABELS = {
  en: {
    attributes: "Core Attributes",
    questLog: "Experience Log",
    education: "Training",
    inventory: "Project Cache",
    download: "Export",
    downloadTitle: "Select Export Format",
    print: "Print / PDF",
    editMode: "Edit Mode",
    save: "Save Changes",
    aiPlaceholder: "Ask AI to analyze or update...",
    aiGreeting: "System Online. Neural Interface Connected. How can I assist with your profile data?",
    coreModules: "Core Modules",
    accessData: "Access Data",
    achievements: "Mission Objectives Completed",
    techStack: "Tech Arsenal",
    applyUpdate: "System Update Available",
    apply: "Execute Patch",
    addItem: "Add Entry",
    import: "Import JSON",
    reset: "Reset",
    layout: "Module Config",
    show: "Show",
    hide: "Hide"
  },
  zh: {
    attributes: "核心属性",
    questLog: "经验日志",
    education: "教育培训",
    inventory: "项目仓库",
    download: "导出",
    downloadTitle: "选择导出格式",
    print: "打印 / PDF",
    editMode: "编辑模式",
    save: "保存更改",
    aiPlaceholder: "让 AI 分析或更新简历...",
    aiGreeting: "系统已上线。神经接口已连接。我能为您的档案数据做些什么？",
    coreModules: "核心模块",
    accessData: "访问数据",
    achievements: "完成的任务目标",
    techStack: "技术武库",
    applyUpdate: "可用系统更新",
    apply: "执行补丁",
    addItem: "添加条目",
    import: "导入 JSON",
    reset: "重置",
    layout: "模块管理",
    show: "显示",
    hide: "隐藏"
  }
};
