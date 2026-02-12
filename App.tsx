import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, Upload, Trash2, Search, Loader2, Sparkles, ChevronRight, ArrowLeft,
  TrendingUp, Activity, Stethoscope, Eye, Users,
  UserCircle, ChevronDown, Banknote, Scale, MapPin, MoreHorizontal, 
  Settings2, ExternalLink, ChevronsRight, ChevronsLeft,
  ChevronLeft, CheckCircle2, ChevronUp, Briefcase, User, Info,
  Mail, Phone, Building2, Calendar, MapPinHouse, X, LayoutGrid,
  Settings, Clock, Fingerprint, Map, AlertCircle, CheckCircle,
  Scan, Building, History, ArrowDownCircle, Check, PiggyBank, Tag, Edit3, Link as LinkIcon
} from 'lucide-react';
import { Deduction, DeductionCategory, DeductionStatus } from './types';
import { generateUniqueCode, parseBulkDeductions } from './geminiService';

// Custom Tooth Icon for Dental
const ToothIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 4C4.5 4 3 6 3 9C3 12 4.5 14 4.5 17.5C4.5 19.5 6 21 8 21C10 21 11 19.5 11 17.5C11 15.5 11 14 12 14C13 14 13 15.5 13 17.5C13 19.5 14 21 16 21C18 21 19.5 19.5 19.5 17.5C19.5 14 21 12 21 9C21 6 19.5 4 17 4C15 4 13.5 5.5 12 5.5C10.5 5.5 9 4 7 4Z" />
  </svg>
);

// Demographic Hover Card Component
const DemographicsCard = ({ employee, onClose }: { employee: Employee, onClose: () => void }) => {
  const d = employee.demographics;
  
  return (
    <div className="absolute z-50 left-0 top-full mt-2 w-[380px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200 p-6 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 cursor-default">
      {/* Top Section: Avatar & Identity */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm overflow-hidden">
          <User className="w-9 h-9 opacity-90" />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h4 className="text-[19px] font-bold text-slate-800 leading-tight truncate">
            {d.firstName} {d.lastName}
          </h4>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">
            {d.jobTitle} <span className="mx-1 text-slate-300">|</span> {d.department}
          </p>
        </div>
      </div>
      
      {/* Middle Section: Details List */}
      <div className="space-y-3.5 mb-6">
        <div className="flex items-start gap-3.5 group">
          <MapPin className="w-[18px] h-[18px] text-slate-400 mt-0.5 shrink-0" />
          <div className="flex flex-col">
             <span className="text-[14px] text-slate-600 font-medium leading-tight">
               {d.city}, {d.state} <span className="text-slate-400 font-normal mx-0.5">—</span> 7:45 AM local time
             </span>
             <span className="text-[12px] text-slate-400 mt-0.5">{d.address1}{d.address2 ? `, ${d.address2}` : ''}</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <Mail className="w-[18px] h-[18px] text-slate-400 shrink-0" />
          <span className="text-[14px] text-slate-600 font-medium truncate">{d.email}</span>
        </div>

        <div className="flex items-center gap-3.5">
          <Building className="w-[18px] h-[18px] text-slate-400 shrink-0" />
          <span className="text-[14px] text-slate-600 font-medium">{d.phone}</span>
        </div>

        {/* Secondary Details for HR Admin */}
        <div className="pt-2 border-t border-slate-50 space-y-2.5">
          <div className="flex items-center gap-3.5">
            <Calendar className="w-[18px] h-[18px] text-indigo-200 shrink-0" />
            <span className="text-[13px] text-slate-500 font-medium">DOB: {d.dob}</span>
          </div>
          <div className="flex items-center gap-3.5">
            <User className="w-[18px] h-[18px] text-indigo-200 shrink-0" />
            <span className="text-[13px] text-slate-500 font-medium">Sex: {d.sex}</span>
          </div>
          <div className="flex items-center gap-3.5">
            <Fingerprint className="w-[18px] h-[18px] text-indigo-200 shrink-0" />
            <span className="text-[13px] text-slate-500 font-medium">SSN: {d.ssn}</span>
          </div>
        </div>
      </div>

      {/* Footer Section: Action Link */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button className="flex items-center gap-2 text-[14px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group">
          <Scan className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
          Open Snapshot View
        </button>
        <div className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
           <Clock className="w-3 h-3 text-slate-400" />
           <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Synced {new Date(employee.lastSyncedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

// Mock Initial Data for Deductions
const INITIAL_DEDUCTIONS: Deduction[] = [
  { id: '1', planName: 'Basic PPO', providerName: 'BlueCross BlueShield', category: DeductionCategory.MEDICAL, subtype: 'PPO Plan', payrollCode: 'MED-BCBS-01', status: DeductionStatus.ACTIVE, isPreTax: true, createdAt: new Date('2024-01-15').toISOString(), employeeCount: 142 },
  { id: '2', planName: '401k Match', providerName: 'Fidelity', category: DeductionCategory.RETIREMENT, subtype: '401(k)', payrollCode: 'RET-FID-01', status: DeductionStatus.ACTIVE, isPreTax: true, createdAt: new Date('2023-11-20').toISOString(), employeeCount: 385 },
  { id: '5', planName: 'Family HMO', providerName: 'IHC', category: DeductionCategory.MEDICAL, subtype: 'HMO Plan', payrollCode: 'IHC-FAM-HMO', status: DeductionStatus.ACTIVE, isPreTax: true, createdAt: new Date().toISOString(), employeeCount: 0 },
  { id: '3', planName: 'Delta Dental Premier', providerName: 'Delta Dental', category: DeductionCategory.DENTAL, subtype: 'Dental PPO', payrollCode: 'DEN-DEL-01', status: DeductionStatus.ACTIVE, isPreTax: true, createdAt: new Date('2024-02-05').toISOString(), employeeCount: 210 },
  { id: '4', planName: 'Vision Gold', providerName: 'VSP', category: DeductionCategory.VISION, subtype: 'Vision PPO', payrollCode: 'VIS-VSP-01', status: DeductionStatus.ACTIVE, isPreTax: true, createdAt: new Date('2024-03-01').toISOString(), employeeCount: 189 }
];

interface EnrollmentDetail {
  name: string;
  type: string;
  frequency: string;
  startDate: string;
  endDate: string;
  employeeAmount: string;
  employerAmount: string;
  isSynced?: boolean;
  lastSynced: string;
}

interface Employee {
  id: string;
  name: string;
  lastSyncedAt: string;
  enrollments: EnrollmentDetail[];
  demographics: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    dob: string;
    sex: string;
    ssn: string;
    jobTitle: string;
    department: string;
    location: string;
    hireDate: string;
  };
}

const NAMES = [
  "Sarah Jenkins", "Michael Chen", "Elena Rodriguez", "David Smith", "Lisa Wong",
  "James Wilson", "Maria Garcia", "Robert Taylor", "Linda Martinez", "William Brown",
  "Elizabeth Davis", "Christopher Miller", "Patricia Wilson", "Matthew Moore", "Jennifer Taylor"
];

const DEPARTMENTS = ["Engineering", "Product", "Sales", "Customer Success", "Operations", "Legal", "Marketing"];
const JOB_TITLES = ["Senior Manager", "Lead Architect", "Analyst", "Developer", "Specialist", "Coordinator"];
const LOCATIONS = ["San Francisco, CA", "New York, NY", "Austin, TX", "Remote", "Chicago, IL"];

const getPastDate = (mins: number) => new Date(Date.now() - mins * 60000).toISOString();

const standardPackage: EnrollmentDetail[] = [
  { name: 'Basic PPO', type: 'Medical', frequency: 'Bi-weekly', startDate: '01/01/2024', endDate: '-', employeeAmount: '$155.00', employerAmount: '$420.00', isSynced: true, lastSynced: getPastDate(5) },
  { name: 'Delta Dental Premier', type: 'Dental', frequency: 'Monthly', startDate: '01/01/2024', endDate: '-', employeeAmount: '$48.50', employerAmount: '$12.00', isSynced: true, lastSynced: getPastDate(120) },
  { name: 'Vision Gold', type: 'Vision', frequency: 'Monthly', startDate: '01/01/2024', endDate: '-', employeeAmount: '$14.20', employerAmount: '$0.00', isSynced: true, lastSynced: getPastDate(1500) },
  { name: '401k Match', type: 'Retirement', frequency: 'Monthly', startDate: '01/01/2024', endDate: '-', employeeAmount: '5%', employerAmount: '3%', isSynced: true, lastSynced: getPastDate(45) }
];

const ALL_EMPLOYEES: Employee[] = NAMES.map((name, index) => {
  const parts = name.split(' ');
  return {
    id: `EMP${(index + 1).toString().padStart(3, '0')}`,
    name,
    lastSyncedAt: getPastDate(Math.floor(Math.random() * 1440)), // Random sync in last 24h
    enrollments: standardPackage,
    demographics: {
      firstName: parts[0],
      middleName: index % 3 === 0 ? "A." : "",
      lastName: parts[1],
      email: `${name.toLowerCase().replace(' ', '.')}@company.com`,
      phone: `(555) ${100 + index}-${2000 + index}`,
      address1: `${123 + index} Market St`,
      address2: index % 4 === 0 ? `Suite ${100 + index}` : "",
      city: LOCATIONS[index % LOCATIONS.length].split(', ')[0],
      state: LOCATIONS[index % LOCATIONS.length].split(', ')[1] || "TX",
      zip: `9410${index % 9}`,
      dob: `0${(index % 9) + 1}/15/19${80 + (index % 15)}`,
      sex: index % 2 === 0 ? "Female" : "Male",
      ssn: `***-**-${4500 + index}`,
      jobTitle: JOB_TITLES[index % JOB_TITLES.length],
      department: DEPARTMENTS[index % DEPARTMENTS.length],
      location: LOCATIONS[index % LOCATIONS.length],
      hireDate: 'Mar 15, 2021'
    }
  };
});

export default function App() {
  const [activeTab, setActiveTab] = useState<'deductions' | 'employees'>('deductions');
  const [deductions, setDeductions] = useState<Deduction[]>(INITIAL_DEDUCTIONS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [viewingEmployeesForDeduction, setViewingEmployeesForDeduction] = useState<Deduction | null>(null);
  const [historyContext, setHistoryContext] = useState<{ deduction: Deduction, employee?: Employee } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDemographicsId, setActiveDemographicsId] = useState<string | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  
  const popoverRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set(ALL_EMPLOYEES.slice(0, 10).map(e => e.id)));

  // Outside click handler for demographic card and settings menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActiveDemographicsId(null);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setIsSettingsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDeductions = deductions.filter(d => 
    d.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.payrollCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting: Alphabetical
  const sortedDeductions = useMemo(() => {
    return [...filteredDeductions].sort((a, b) => a.planName.localeCompare(b.planName));
  }, [filteredDeductions]);

  const filteredEmployeesData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return ALL_EMPLOYEES.filter(emp => selectedEmployeeIds.has(emp.id))
      .map(emp => {
        const matchingEnrollments = emp.enrollments.filter(en => 
          emp.name.toLowerCase().includes(query) || 
          en.name.toLowerCase().includes(query) || 
          en.type.toLowerCase().includes(query)
        );
        return { ...emp, enrollments: matchingEnrollments };
      })
      .filter(emp => emp.enrollments.length > 0);
  }, [selectedEmployeeIds, searchQuery]);

  const handleAddDeduction = (newDeduction: Deduction) => {
    const deductionWithMappedStatus = {
      ...newDeduction,
      status: DeductionStatus.ACTIVE,
      employeeCount: 0
    };
    setDeductions(prev => [deductionWithMappedStatus, ...prev]);
    setIsAddModalOpen(false);
    setShowSuccessBanner(true);
  };

  const toggleDeductionStatus = (id: string) => {
    setDeductions(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, status: d.status === DeductionStatus.ACTIVE ? DeductionStatus.INACTIVE : DeductionStatus.ACTIVE };
      }
      return d;
    }));
  };

  const handleBulkAdd = (newDeductions: any[]) => {
    const formatted = newDeductions.map(d => ({
      ...d, 
      id: Math.random().toString(36).substr(2, 9), 
      status: DeductionStatus.ACTIVE, 
      isPreTax: true, 
      subtype: d.category || 'Standard',
      payrollCode: (d.suggestedCode || d.payrollCode || '').substring(0, 12).toUpperCase(),
      createdAt: new Date().toISOString(), 
      employeeCount: Math.floor(Math.random() * 200) + 50 
    }));
    setDeductions(prev => [...formatted, ...prev]);
    setIsBulkModalOpen(false);
    setIsSettingsMenuOpen(false);
    setShowSuccessBanner(true);
  };

  return (
    <div className="h-screen flex flex-col font-sans bg-[#F9FAFB] overflow-hidden text-slate-900 relative">
      {/* Updated Success Slidedown Banner - Emerald Green */}
      <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out transform ${showSuccessBanner ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-4xl mx-auto mt-4 px-6 py-4 bg-emerald-600 rounded-xl shadow-2xl border border-emerald-700 flex items-center gap-4 text-white">
          <div className="p-2 bg-emerald-500 rounded-lg shadow-sm border border-emerald-400 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[15px] leading-tight">Your new deduction was added to BambooHR successfully!</h3>
            <p className="text-emerald-50 text-[13px] font-medium mt-0.5">You'll need to map your new deduction inside Employee Navigator.</p>
          </div>
          <div className="flex items-center gap-4 shrink-0 ml-4">
            <button 
              className="px-5 py-2 bg-white text-emerald-600 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors shadow-sm"
              onClick={() => { /* Navigation logic would go here */ }}
            >
              Go to Employee Navigator
            </button>
            <button onClick={() => setShowSuccessBanner(false)} className="p-1 hover:bg-emerald-500 rounded-full transition-colors shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <header className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#5850EC] p-2 rounded-lg flex items-center justify-center shadow-sm">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Payroll Deductions</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full overflow-hidden">
        <div className="flex items-center gap-8 mb-6 border-b border-slate-200 px-1 flex-shrink-0">
          <button onClick={() => setActiveTab('deductions')} className={`pb-3 text-lg font-bold transition-all relative ${activeTab === 'deductions' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
            Deductions {activeTab === 'deductions' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5850EC] rounded-t-full" />}
          </button>
          <button onClick={() => setActiveTab('employees')} className={`pb-3 text-lg font-bold transition-all relative ${activeTab === 'employees' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
            Employees {activeTab === 'employees' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5850EC] rounded-t-full" />}
          </button>
        </div>

        <div className="flex items-center justify-between mb-6 flex-shrink-0 h-10">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder={activeTab === 'deductions' ? "Filter deductions..." : "Search name, plan or type..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm" />
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'deductions' ? (
              <div className="flex items-center gap-2 relative">
                <button 
                  onClick={() => setIsAddModalOpen(true)} 
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#5850EC] rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Deduction
                </button>
                <div className="relative" ref={settingsMenuRef}>
                  <button 
                    onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                    className={`p-2.5 rounded-lg transition-all shadow-sm border ${isSettingsMenuOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  {isSettingsMenuOpen && (
                    <div className="absolute right-0 mt-2 w-max bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-200 py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={() => { setIsBulkModalOpen(true); setIsSettingsMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left whitespace-nowrap"
                      >
                        <Upload className="w-4 h-4 text-indigo-600 shrink-0" />
                        Bulk Import
                      </button>
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left whitespace-nowrap"
                      >
                        <ExternalLink className="w-4 h-4 text-indigo-600 shrink-0" />
                        Go to Employee Navigator
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 relative">
                <button 
                  onClick={() => setIsManageModalOpen(true)} 
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#5850EC] rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                >
                  <Settings2 className="w-4 h-4" />
                  Manage Employees
                </button>
                <div className="relative" ref={settingsMenuRef}>
                  <button 
                    onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                    className={`p-2.5 rounded-lg transition-all shadow-sm border ${isSettingsMenuOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  {isSettingsMenuOpen && (
                    <div className="absolute right-0 mt-2 w-max bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-200 py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left whitespace-nowrap"
                      >
                        <ExternalLink className="w-4 h-4 text-indigo-600 shrink-0" />
                        Go to Employee Navigator
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'deductions' ? (
            <div className="bg-white border border-slate-200 rounded-xl flex-1 flex flex-col overflow-hidden shadow-sm">
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="sticky top-0 z-10"><tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payroll Code</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tax Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"><div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />Employees</div></th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedDeductions.length > 0 ? sortedDeductions.map((d) => (
                      <tr key={d.id} className={`transition-colors group hover:bg-slate-50/50`}>
                        <td className="px-6 py-4"><div className="flex flex-col"><span className="text-sm font-bold text-slate-900">{d.planName}</span><span className="text-xs text-slate-500 font-medium">{d.category}</span></div></td>
                        <td className="px-6 py-4"><code className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100 uppercase tracking-wider">{d.payrollCode}</code></td>
                        <td className="px-6 py-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${d.isPreTax ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-600'}`}>{d.isPreTax ? 'Pre-Tax' : 'Post-Tax'}</span></td>
                        <td className="px-6 py-4">
                          <button onClick={() => setViewingEmployeesForDeduction(d)} className="text-sm font-black text-indigo-600 hover:underline flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" /> {d.employeeCount}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-3">
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${d.status === DeductionStatus.ACTIVE ? 'text-indigo-600' : 'text-slate-400'}`}>
                              {d.status === DeductionStatus.ACTIVE ? 'Active' : 'Inactive'}
                            </span>
                            <button onClick={() => toggleDeductionStatus(d.id)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${d.status === DeductionStatus.ACTIVE ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${d.status === DeductionStatus.ACTIVE ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (<tr><td colSpan={5} className="p-12 text-center text-slate-400 font-medium italic">No deductions found.</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl flex-1 flex flex-col overflow-hidden shadow-sm">
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="sticky top-0 z-10"><tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee / Plan Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Freq</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Start</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">End</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Employee Amt</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Employer Amt</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployeesData.length > 0 ? filteredEmployeesData.map((emp) => (
                      <React.Fragment key={emp.id}>
                        <tr className="bg-slate-50/50 border-t border-slate-200">
                          <td colSpan={8} className="px-6 py-3 relative">
                            <div className="flex items-center justify-between">
                              <div 
                                className="relative" 
                                ref={activeDemographicsId === emp.id ? popoverRef : null}
                              >
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDemographicsId(prev => prev === emp.id ? null : emp.id);
                                  }}
                                  className={`text-sm font-black text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 underline-offset-4 decoration-2 transition-all tracking-tight ${activeDemographicsId === emp.id ? 'decoration-indigo-600' : ''}`}
                                >
                                  {emp.name}
                                </button>
                                {activeDemographicsId === emp.id && (
                                  <DemographicsCard 
                                    employee={emp} 
                                    onClose={() => setActiveDemographicsId(null)} 
                                  />
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                        {emp.enrollments.map((en, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 pl-10"><span className="text-sm font-bold text-slate-700">{en.name}</span></td>
                            <td className="px-6 py-4"><span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">{en.type}</span></td>
                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">{en.frequency}</td>
                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">{en.startDate}</td>
                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">{en.endDate}</td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <span className="text-sm font-black text-slate-900">{en.employeeAmount}</span>
                              <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-tighter">/ pp</span>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <span className="text-sm font-black text-slate-900">{en.employerAmount}</span>
                              <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-tighter">/ pp</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => {
                                  const deductionObj = deductions.find(d => d.planName === en.name);
                                  if (deductionObj) {
                                    setHistoryContext({ deduction: deductionObj, employee: emp });
                                  } else {
                                    setHistoryContext({ 
                                      deduction: {
                                        id: 'mock',
                                        planName: en.name,
                                        providerName: 'Current Provider',
                                        category: en.type,
                                        subtype: 'Standard',
                                        payrollCode: 'SYNC-PLAN-01',
                                        status: DeductionStatus.ACTIVE,
                                        isPreTax: true,
                                        createdAt: new Date('2024-01-01').toISOString(),
                                        employeeCount: 1
                                      },
                                      employee: emp 
                                    });
                                  }
                                }}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="View Deduction History"
                              >
                                <History className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    )) : (<tr><td colSpan={8} className="p-12 text-center text-slate-400 font-medium italic">No matching plans found.</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {isAddModalOpen && <QuickBuildDeductionModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddDeduction} />}
      {isBulkModalOpen && <BulkImportModal onClose={() => setIsBulkModalOpen(false)} onImport={handleBulkAdd} />}
      {isManageModalOpen && (<ManageEmployeesModal allEmployees={ALL_EMPLOYEES} currentSelectedIds={selectedEmployeeIds} onClose={() => setIsManageModalOpen(false)} onSave={(ids) => { setSelectedEmployeeIds(ids); setIsManageModalOpen(false); }} />)}
      {viewingEmployeesForDeduction && (<EmployeeListModal deduction={viewingEmployeesForDeduction} onClose={() => setViewingEmployeesForDeduction(null)} />)}
      {historyContext && (<DeductionHistoryModal deduction={historyContext.deduction} employee={historyContext.employee} onClose={() => setHistoryContext(null)} />)}
    </div>
  );
}

// --- DEDUCTION HISTORY SNAPSHOT MODAL ---
function DeductionHistoryModal({ deduction, employee, onClose }: { deduction: Deduction, employee?: Employee, onClose: () => void }) {
  const [filter, setFilter] = useState('2025 Year-To-Date');
  const [isDeductionHistoryExpanded, setIsDeductionHistoryExpanded] = useState(false);

  const mainEvents = [
    { date: '6/28/2026', user: 'BambooHR', event: 'Contribution Made', comment: 'Federal Limit Reached', highlight: true },
    { date: '6/28/2026', user: 'BambooHR', event: 'Deduction Paid', comment: 'Employee Paid $500.00 / Employer Paid $130.00', expandable: true, showCount: 3 },
  ];

  const hiddenEvents = [
    { date: '6/14/2026', user: 'BambooHR', event: 'Deduction Paid', comment: 'Employee Paid $500.00 / Employer Paid $130.00' },
    { date: '5/31/2026', user: 'BambooHR', event: 'Deduction Paid', comment: 'Employee Paid $500.00 / Employer Paid $130.00' },
    { date: '5/15/2026', user: 'BambooHR', event: 'Deduction Paid', comment: 'Employee Paid $500.00 / Employer Paid $130.00' },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[90vh] animate-in fade-in zoom-in duration-300 border border-slate-200">
        
        {/* Header Area */}
        <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[28px] font-bold text-indigo-700 tracking-tight">Deduction History Snapshot</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                <img src={`https://i.pravatar.cc/150?u=${employee?.id || 'charlotte'}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 leading-tight">{employee?.name || "Employee Name"}</h3>
                <p className="text-sm text-slate-500 font-medium">
                  {employee?.demographics.jobTitle || "Account Manager"}, {employee?.demographics.department || "Sales"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Show</span>
              <div className="relative group min-w-[200px]">
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                >
                  <option>2025 Year-To-Date</option>
                  <option>2024 Year-To-Date</option>
                  <option>Lifetime View</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2.5 bg-indigo-50 rounded-lg">
                <PiggyBank className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-[24px] font-bold text-indigo-700 leading-tight">{deduction.planName}</h4>
                <p className="text-sm font-bold text-slate-400">Benefit Plan</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-indigo-50 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h5 className="text-[17px] font-bold text-indigo-700 mb-1">Employee Contributions</h5>
                <p className="text-sm text-slate-500 font-medium">
                  $10,000 left to reach the 401(k) contribution limit for this year.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-slate-500 shrink-0">$18,000.00 Paid</span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full w-[75%]" />
                </div>
                <span className="text-sm font-bold text-slate-500 shrink-0">of $24,000.00 Max Limit</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm hover:border-indigo-100 transition-colors">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h6 className="text-[16px] font-bold text-indigo-700 leading-snug">Active</h6>
                <p className="text-[16px] font-bold text-indigo-700 leading-tight">5/1/2024 - 7/31/2025</p>
              </div>
              <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm hover:border-indigo-100 transition-colors">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h6 className="text-[16px] font-bold text-indigo-700 leading-snug truncate">{deduction.planName}</h6>
              </div>
              <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Deduction Type</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm hover:border-indigo-100 transition-colors">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h6 className="text-[16px] font-bold text-indigo-700 leading-snug">Employee - 10%</h6>
                <p className="text-[16px] font-bold text-indigo-700 leading-tight">Company - 6% Match</p>
              </div>
              <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Year-To-Date</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Performed by</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Comment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {mainEvents.map((ev, i) => (
                  <tr key={`main-${i}`} className="group hover:bg-indigo-50/20 transition-colors">
                    <td className="px-6 py-5 font-bold text-slate-600">
                      <div className="flex items-center gap-2">
                        {ev.highlight && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                        {ev.date}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-600">{ev.user}</td>
                    <td className="px-6 py-5 font-bold text-slate-600">{ev.event}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-medium text-slate-500">{ev.comment}</span>
                        {ev.expandable && (
                          <button 
                            onClick={() => setIsDeductionHistoryExpanded(!isDeductionHistoryExpanded)}
                            className={`flex items-center gap-1.5 text-indigo-600 font-black hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-all active:scale-95`}
                          >
                            {isDeductionHistoryExpanded ? 'Hide' : 'Show'} ({ev.showCount}) 
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDeductionHistoryExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {isDeductionHistoryExpanded && hiddenEvents.map((ev, i) => (
                  <tr key={`hidden-${i}`} className="bg-indigo-50/10 animate-in slide-in-from-top-2 duration-300 border-l-4 border-l-indigo-500">
                    <td className="px-6 py-4 pl-10 font-bold text-slate-500">{ev.date}</td>
                    <td className="px-6 py-4 font-bold text-slate-500">{ev.user}</td>
                    <td className="px-6 py-4 font-bold text-slate-500">{ev.event}</td>
                    <td className="px-6 py-4 font-medium text-slate-400 italic">{ev.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        <div className="px-10 py-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-4">
          <button className="px-8 py-3 rounded-full bg-white border border-slate-300 text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-slate-400" />
            Edit Deductions in Employee Profile
          </button>
          <button onClick={onClose} className="px-10 py-3 rounded-full bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

// --- EMPLOYEE LIST MODAL ---
function EmployeeListModal({ deduction, onClose }: { deduction: Deduction, onClose: () => void }) {
  const enrolledEmployees = useMemo(() => {
    return NAMES.slice(0, 12).map((name, i) => ({ id: `EMP${i.toString().padStart(3, '0')}`, name }));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[70vh] animate-in fade-in zoom-in duration-300 border border-slate-200">
        <div className="px-10 pt-8 pb-6 border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <div className="flex justify-between items-start mb-2">
            <div><h2 className="text-2xl font-black text-slate-900 tracking-tight">Enrolled Employees</h2><p className="text-sm font-bold text-slate-500">{deduction.planName} • {deduction.providerName}</p></div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"><Plus className="w-6 h-6 rotate-45" /></button>
          </div>
          <div className="flex items-center gap-2 mt-4"><div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-black rounded-full border border-indigo-100 uppercase tracking-wider">Total: {deduction.employeeCount} Enrolled</div></div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-6"><div className="space-y-1"><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Employee Directory</h3>
          {enrolledEmployees.map((emp) => (
            <div key={emp.id} className="flex items-center justify-between py-3 group hover:bg-indigo-50 -mx-4 px-4 rounded-xl transition-colors">
              <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm"><User className="w-4.5 h-4.5" /></div><div className="flex flex-col"><span className="text-sm font-bold text-slate-700">{emp.name}</span><span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{emp.id}</span></div></div>
              <button className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"><ExternalLink className="w-4 h-4" /></button>
            </div>
          ))}
          <div className="py-6 text-center"><p className="text-xs text-slate-400 italic font-medium">... and {deduction.employeeCount - enrolledEmployees.length} more employees</p></div>
        </div></div>
        <div className="p-8 border-t border-slate-100 bg-white flex justify-end"><button onClick={onClose} className="px-10 py-3.5 rounded-full bg-indigo-600 text-white text-sm font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">Close List</button></div>
      </div>
    </div>
  );
}

// --- SMART SLATE DEDUCTION MODAL ---
function QuickBuildDeductionModal({ onClose, onAdd }: { onClose: () => void, onAdd: (d: Deduction) => void }) {
  const [category, setCategory] = useState<string | null>(null);
  const [subtype, setSubtype] = useState<string | null>(null);
  const [details, setDetails] = useState({ planName: '', providerName: '', payrollCode: '', isPreTax: true });
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeCategory = useMemo(() => CATEGORIES.find(c => c.id === category), [category]);

  const handleCategorySelect = (id: string) => {
    setCategory(id); setSubtype(null);
    setDetails(prev => ({ ...prev, isPreTax: !(id === 'STATUTORY' || id === 'GARNISHMENT') }));
  };

  useEffect(() => {
    const deriveCode = (provider: string, plan: string) => {
      const clean = (s: string) => s.trim().split(' ')[0].replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase();
      const p1 = clean(provider); const p2 = clean(plan);
      if (!p1 && !p2) return '';
      const combined = p1 && p2 ? `${p1}-${p2}` : (p1 || p2);
      return combined.substring(0, 12);
    };
    if (details.providerName || details.planName) {
      setDetails(prev => ({ ...prev, payrollCode: deriveCode(details.providerName, details.planName) }));
    }
  }, [details.providerName, details.planName]);

  const handleFinish = () => {
    if (!activeCategory || !subtype) return;
    onAdd({ 
      id: Math.random().toString(36).substr(2, 9), 
      category: activeCategory.title, 
      subtype: subtype, 
      status: DeductionStatus.ACTIVE, 
      createdAt: new Date().toISOString(), 
      employeeCount: 0, 
      ...details 
    });
  };

  const isReady = !!(category && subtype && details.planName && details.providerName && details.payrollCode);

  const placeholders = useMemo(() => {
    if (!category) return { provider: 'e.g. Fidelity', plan: 'e.g. 401k Standard' };
    switch (category) {
      case 'MEDICAL': return { provider: 'e.g. BlueCross BlueShield', plan: 'e.g. Basic PPO' };
      case 'DENTAL': return { provider: 'e.g. Delta Dental', plan: 'e.g. Premier Plus' };
      case 'VISION': return { provider: 'e.g. VSP', plan: 'e.g. Vision Gold' };
      case 'RETIREMENT': return { provider: 'e.g. Vanguard', plan: 'e.g. 401(k) Contribution' };
      case 'BENEFITS': return { provider: 'e.g. HealthEquity', plan: 'e.g. HSA Basic' };
      case 'GARNISHMENT': return { provider: 'e.g. Dept of Justice', plan: 'e.g. Child Support Order' };
      case 'LOAN': return { provider: 'e.g. Principal', plan: 'e.g. 401k Loan Repayment' };
      case 'STATUTORY': return { provider: 'e.g. State Program', plan: 'e.g. PFML' };
      default: return { provider: 'e.g. Provider Name', plan: 'e.g. Plan Name' };
    }
  }, [category]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[85vh] animate-in fade-in zoom-in duration-300 border border-slate-200">
        <div className="px-10 pt-8 pb-6 border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-black text-indigo-700 tracking-tight">Add Payroll Deduction</h2>
              <p className="text-sm font-medium text-slate-500 max-w-lg mt-1 leading-relaxed">
                Adding deductions here will make it so you can sync your benefit plans with what you'll see when running Payroll and Reports in BambooHR.
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"><Plus className="w-6 h-6 rotate-45" /></button>
          </div>
          <div className={`p-5 rounded-2xl border-2 transition-all duration-500 bg-white shadow-sm flex items-center justify-between ${category ? 'border-indigo-100 scale-100 opacity-100' : 'border-slate-100 scale-95 opacity-50 grayscale'}`}>
            <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">{activeCategory ? <activeCategory.icon className="w-6 h-6 text-indigo-600" /> : <Plus className="w-5 h-5 text-slate-300" />}</div><div className="flex flex-col"><span className="text-sm font-bold text-slate-900 leading-none mb-1">{details.planName || "New Plan Draft"}</span><span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{category ? `${activeCategory?.title} • ${subtype || 'Select Subtype'}` : "Awaiting Configuration..."}</span></div></div>
            <div className="flex flex-col items-end text-right"><span className="font-mono text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">{details.payrollCode || "CODE-?"}</span><span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{details.isPreTax ? "Pre-Tax Applied" : "Post-Tax Applied"}</span></div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-10 py-10 space-y-12 scroll-smooth custom-scrollbar">
          <div className="space-y-6"><div className="flex items-center gap-3"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${category ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-500'}`}>1</div><div><h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Step One</h3><p className="text-base font-extrabold text-slate-800 tracking-tight">Select Category</p></div></div>
             <div className="grid grid-cols-3 gap-3 animate-in fade-in duration-300">{CATEGORIES.map(cat => (
                 <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all text-center group ${category === cat.id ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}><cat.icon className={`w-6 h-6 mb-2 transition-colors ${category === cat.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} /><span className={`text-[12px] font-bold uppercase tracking-tight ${category === cat.id ? 'text-indigo-700' : 'text-slate-600'}`}>{cat.title}</span></button>
               ))}</div></div>

          <div className={`space-y-6 transition-all duration-300 ${!category ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
             <div className="flex items-center gap-3"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${subtype ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-500'}`}>2</div><div><h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Step Two</h3><p className="text-base font-extrabold text-slate-800 tracking-tight">Choose Subtype</p></div></div>
             <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">{activeCategory?.subtypes.map(sub => (
                 <button key={sub} onClick={() => setSubtype(sub)} className={`px-6 py-2 rounded-full border-2 text-[11px] font-black uppercase tracking-widest transition-all ${subtype === sub ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'border-slate-100 text-slate-500 hover:bg-slate-50 bg-white'}`}>{sub}</button>
               ))}</div></div>

          <div className={`space-y-8 transition-all duration-300 ${!subtype ? 'opacity-30 pointer-events-none grayscale' : ''} pb-10`}>
             <div className="flex items-center gap-3"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${details.planName && details.providerName ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-500'}`}>3</div><div><h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Step Three</h3><p className="text-base font-extrabold text-slate-800 tracking-tight">Finalize Details</p></div></div>
             <div className="space-y-6 animate-in fade-in duration-300">
               <div className="flex gap-4 p-5 bg-indigo-50/80 rounded-2xl border border-indigo-100 animate-in slide-in-from-bottom-2 duration-500">
                 <div className="p-2 bg-white rounded-lg shadow-sm border border-indigo-100 h-fit">
                    <Info className="w-5 h-5 text-indigo-600" />
                 </div>
                 <div className="flex-1">
                   <h4 className="text-xs font-black text-indigo-700 mb-1 leading-snug">
                     Choose a plan name and payroll code that you'll recognize and want to keep.
                   </h4>
                   <p className="text-[11px] text-indigo-600/70 font-bold leading-relaxed">
                     Once this deduction is used in Payroll, it'll be locked. To make changes, you'd need to add a new deduction and remap it in Employee Navigator.
                   </p>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Provider Name</label>
                    <input placeholder={placeholders.provider} className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all text-sm font-bold bg-white shadow-sm" value={details.providerName} onChange={e => setDetails({...details, providerName: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Plan Name</label>
                    <input placeholder={placeholders.plan} className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all text-sm font-bold bg-white shadow-sm" value={details.planName} onChange={e => setDetails({...details, planName: e.target.value})} /></div></div>
               
               <div className="flex flex-col items-start gap-2.5 px-1 py-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Pre-tax Deduction</label>
                  <button onClick={() => setDetails(d => ({ ...d, isPreTax: !d.isPreTax }))} className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${details.isPreTax ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${details.isPreTax ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
               </div>

               <div className="space-y-3"><div className="px-1"><label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Payroll Code</label></div>
                  <div className="space-y-2"><div className="relative group max-w-sm">
                      <input 
                        className="w-full pl-5 pr-5 py-4 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all text-base font-black text-slate-900 bg-white uppercase font-mono tracking-wider shadow-sm" 
                        value={details.payrollCode} 
                        onChange={e => setDetails({...details, payrollCode: e.target.value.toUpperCase().substring(0, 12)})} 
                        placeholder="CODE-XYZ" 
                        maxLength={12}
                      />
                      </div>
                    <div className="flex items-center gap-1.5 ml-1 font-medium"><Info className="w-3 h-3 text-slate-400" /><p className="text-[10px] text-slate-400 tracking-tight">Max 12 characters. Once the code is created it can not be changed.</p></div></div></div>
            </div>
          </div>
        </div>
        <div className="p-10 border-t border-slate-200 bg-slate-50 flex items-center justify-end flex-shrink-0"><div className="flex gap-4"><button onClick={onClose} className="px-8 py-3.5 text-sm font-black text-slate-500 hover:text-slate-800 transition-colors">Discard</button>
            <button disabled={!isReady} onClick={handleFinish} className="px-12 py-3.5 rounded-lg bg-indigo-600 text-white text-sm font-black hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-xl shadow-indigo-200 active:scale-95">Add to Payroll</button></div></div>
      </div>
    </div>
  );
}

function ManageEmployeesModal({ allEmployees, currentSelectedIds, onClose, onSave }: { allEmployees: Employee[], currentSelectedIds: Set<string>, onClose: () => void, onSave: (ids: Set<string>) => void }) {
  const [selectedInModal, setSelectedInModal] = useState<Set<string>>(new Set(currentSelectedIds));
  const [leftSearch, setLeftSearch] = useState('');
  const [highlightedLeft, setHighlightedLeft] = useState<Set<string>>(new Set());
  const [highlightedRight, setHighlightedRight] = useState<Set<string>>(new Set());
  const availableEmployees = allEmployees.filter(e => !selectedInModal.has(e.id) && e.name.toLowerCase().includes(leftSearch.toLowerCase()));
  const selectedEmployees = allEmployees.filter(e => selectedInModal.has(e.id));
  const toggleLeftHighlight = (id: string) => setHighlightedLeft(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const toggleRightHighlight = (id: string) => setHighlightedRight(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const moveAllRight = () => { setSelectedInModal(new Set(allEmployees.map(e => e.id))); setHighlightedLeft(new Set()); };
  const moveAllLeft = () => { setSelectedInModal(new Set()); setHighlightedRight(new Set()); };
  const moveSelectedRight = () => { if (highlightedLeft.size > 0) { setSelectedInModal(prev => { const next = new Set(prev); highlightedLeft.forEach(id => next.add(id)); return next; }); setHighlightedLeft(new Set()); } };
  const moveSelectedLeft = () => { if (highlightedRight.size > 0) { setSelectedInModal(prev => { const next = new Set(prev); highlightedRight.forEach(id => next.delete(id)); return next; }); setHighlightedRight(new Set()); } };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-[650px] animate-in fade-in zoom-in duration-200 border border-slate-200">
        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between"><h2 className="text-xl font-black text-indigo-700">Manage Employee Access</h2><button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Plus className="w-6 h-6 rotate-45 text-slate-400" /></button></div>
        <div className="flex-1 p-8 grid grid-cols-[1fr,80px,1fr] gap-6 min-h-0 bg-white">
          <div className="flex flex-col min-h-0"><h3 className="text-sm font-black text-slate-400 mb-3 uppercase tracking-widest">Available</h3><div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col min-h-0 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-3"><div className="relative group"><select className="w-full pl-3 pr-10 py-2.5 text-sm font-bold border border-slate-200 rounded-xl appearance-none bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all"><option>All employees</option></select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" /></div>
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search..." value={leftSearch} onChange={(e) => setLeftSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm font-bold border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 transition-all bg-white text-slate-900" /></div></div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">{availableEmployees.map(e => (<button key={e.id} onClick={() => toggleLeftHighlight(e.id)} className={`w-full flex items-center justify-between px-5 py-4 transition-all text-left group ${highlightedLeft.has(e.id) ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}><span className="text-sm font-bold">{e.name}</span></button>))}</div></div></div>
          <div className="flex flex-col items-center justify-center gap-4">
            <button onClick={moveAllRight} className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-95 group"><ChevronsRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" /></button>
            <button onClick={moveSelectedRight} className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-95 group"><ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" /></button>
            <button onClick={moveSelectedLeft} className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-95 group"><ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" /></button>
            <button onClick={moveAllLeft} className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-95 group"><ChevronsLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" /></button>
          </div>
          <div className="flex flex-col min-h-0"><h3 className="text-sm font-black text-slate-400 mb-3 uppercase tracking-widest">Selected</h3><div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col min-h-0 shadow-sm overflow-hidden"><div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">{selectedEmployees.length > 0 ? selectedEmployees.map(e => (<button key={e.id} onClick={() => toggleRightHighlight(e.id)} className={`w-full flex items-center justify-between px-5 py-4 transition-all text-left ${highlightedRight.has(e.id) ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}><span className="text-sm font-bold">{e.name}</span></button>)) : (<div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400"><div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4"><UserCircle className="w-8 h-8 opacity-10" /></div><p className="text-sm font-bold text-slate-400">None added yet.</p></div>)}</div></div></div>
        </div>
        <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50"><button onClick={onClose} className="px-6 py-2.5 text-sm font-black text-slate-500 hover:text-slate-800 transition-colors">Cancel</button><button onClick={() => onSave(selectedInModal)} className="px-10 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-lg shadow-indigo-200 active:scale-95">Save Selection</button></div>
      </div>
    </div>
  );
}

function BulkImportModal({ onClose, onImport }: { onClose: () => void, onImport: (d: any[]) => void }) {
  const [inputText, setInputText] = useState(''); const [isParsing, setIsParsing] = useState(false);
  const handleParse = async () => { if (!inputText.trim()) return; setIsParsing(true); try { const results = await parseBulkDeductions(inputText); onImport(results); } catch (e) { alert("Error."); } finally { setIsParsing(false); } };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-hidden">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200 border border-slate-200">
        <div className="p-8 pb-4"><h3 className="text-xl font-black text-indigo-700">Bulk Import AI</h3><p className="text-sm text-slate-500 font-medium mt-1">Paste deduction summary text here.</p></div>
        <div className="px-8 py-4 flex-1 overflow-hidden flex flex-col"><textarea className="w-full flex-1 p-5 rounded-2xl border border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none text-sm shadow-inner resize-none font-bold placeholder:font-medium" placeholder="e.g. Plan: BCBS PPO, Category: Medical..." value={inputText} onChange={e => setInputText(e.target.value)} /></div>
        <div className="p-8 flex gap-3"><button onClick={onClose} className="flex-1 px-4 py-3 text-sm font-black text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors">Cancel</button><button onClick={handleParse} disabled={isParsing || !inputText.trim()} className="flex-1 px-4 py-3 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50">{isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}Extract</button></div>
      </div>
    </div>
  );
}

const CATEGORIES = [
  { id: 'MEDICAL', title: 'Medical', desc: 'Health insurance premiums.', icon: Stethoscope, subtypes: ['HMO Plan', 'PPO Plan', 'HDHP Plan', 'EPO Plan'] },
  { id: 'DENTAL', title: 'Dental', desc: 'Dental insurance premiums.', icon: ToothIcon, subtypes: ['Dental HMO', 'Dental PPO', 'Dental Indemnity'] },
  { id: 'VISION', title: 'Vision', desc: 'Vision insurance premiums.', icon: Eye, subtypes: ['Vision PPO', 'Vision Discount Plan'] },
  { id: 'RETIREMENT', title: 'Retirement Contribution', desc: 'Employee contributions.', icon: TrendingUp, subtypes: ['401(k)', 'Roth 401(k)', '403(b)', 'SIMPLE IRA'] },
  { id: 'BENEFITS', title: 'Tax-Advantaged Benefits', desc: 'FSA, HSA, etc.', icon: Activity, subtypes: ['HSA Contribution', 'FSA Medical', 'FSA Dependent Care', 'Commuter Transit', 'Commuter Parking'] },
  { id: 'GARNISHMENT', title: 'Garnishment / Court Order', desc: 'Court mandated.', icon: Scale, subtypes: ['Child Support', 'Tax Levy', 'Creditor Garnishment', 'Other Garnishment'] },
  { id: 'LOAN', title: 'Loan Repayment', desc: 'Borrowing repayment.', icon: Banknote, subtypes: ['401(k) Loan', 'Company Loan', 'Student Loan', 'Other Loan'] },
  { id: 'STATUTORY', title: 'State Program / Statutory', desc: 'Mandatory state.', icon: MapPin, subtypes: ['PFML', 'SUI', 'Disability Insurance', 'Other Statutory'] },
  { id: 'OTHER', title: 'Generic / Other', desc: 'Miscellaneous.', icon: MoreHorizontal, subtypes: ['Life Insurance', 'Gym Membership', 'Dues', 'Miscellaneous'] },
];