
import React, { useState, useRef, useEffect } from 'react';
import { LayoutGrid, TrendingUp, CheckCircle2, Menu, Check, FileText } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { Campaign } from '../types';

type SortCriteria = 'rate' | 'most' | 'fewest' | 'custom';

interface SellerDashboardProps {
  campaigns: Campaign[];
  sortCriteria: SortCriteria;
  onSortChange: (criteria: SortCriteria) => void;
}

const CampaignCard: React.FC<{ 
  campaign: Campaign; 
}> = ({ campaign }) => {
  const isCompleted = campaign.status === 'completed';

  return (
    <div 
      className={`bg-white rounded-3xl p-5 border transition-all flex items-center gap-4 relative ${
        isCompleted ? 'border-[#DFFF00]/50 shadow-md' : 'border-slate-100 shadow-sm'
      }`}
    >
      {/* Images Section */}
      <div className="relative w-24 shrink-0">
        <div className="flex -space-x-4">
          <img 
            src={campaign.thumbnailA} 
            alt="Option A" 
            className="w-16 h-20 rounded-xl object-cover border-2 border-white shadow-sm ring-1 ring-slate-100" 
          />
          <img 
            src={campaign.thumbnailB} 
            alt="Option B" 
            className="w-16 h-20 rounded-xl object-cover border-2 border-white shadow-sm ring-1 ring-slate-100 translate-y-4" 
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-extrabold text-slate-800 truncate pr-2">{campaign.title}</h3>
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0 ${
            isCompleted ? 'bg-[#DFFF00] border-[#DFFF00] text-black' : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}>
            {isCompleted ? '완료' : '진행중'}
          </span>
        </div>

        <div className="space-y-3">
          {/* Stats Hierarchy */}
          <div className="flex justify-between items-baseline">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Qualified Insights</span>
              <span className={`text-xl font-black ${isCompleted ? 'text-emerald-600' : 'text-[#A020F0]'}`}>
                {campaign.insightCount} <span className="text-xs font-bold text-slate-300">/ {campaign.goalCount}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Reach</span>
              <div className="flex items-center justify-end gap-1 text-slate-500">
                <TrendingUp size={12} />
                <span className="text-sm font-extrabold">{campaign.totalVotes.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <ProgressBar current={campaign.insightCount} target={campaign.goalCount} />
        </div>

        {/* Action Button */}
        {isCompleted ? (
          <button className="w-full mt-4 py-3 bg-[#DFFF00] text-black rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all relative">
            <FileText size={14} />
            상세 분석 리포트 보기
            {!campaign.isRead && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </button>
        ) : (
          <button className="w-full mt-4 py-2 bg-slate-50 text-slate-400 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 opacity-60 cursor-not-allowed border border-slate-100">
            상세 분석 리포트 (데이터 수집 중)
          </button>
        )}
      </div>
    </div>
  );
};

const SellerDashboard: React.FC<SellerDashboardProps> = ({ 
  campaigns, 
  sortCriteria, 
  onSortChange
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const totalCampaigns = campaigns.length;
  const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
  const hasUnreadCompleted = campaigns.some(c => c.status === 'completed' && !c.isRead);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-4 space-y-6 pb-24">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      
      <header className="flex justify-between items-center pt-2">
        <div className="space-y-1">
          <p className="text-[#A020F0] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Pick-it Studio</p>
          <h1 className="text-3xl font-black tracking-tight leading-tight">
            <span className="text-[#A020F0]">최재웅</span>님,<br/>반가워요! 👋
          </h1>
        </div>
        
        {/* Animated 3D Character Avatar */}
        <div className="group relative">
          {/* Glowing Background Effect */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-[#DFFF00] via-[#A020F0] to-[#DFFF00] rounded-full blur-[15px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
          
          <div className="relative w-20 h-20 flex items-center justify-center overflow-visible">
            {/* The Avatar Container */}
            <div className="animate-float">
              <div className="relative w-16 h-16 bg-white/40 backdrop-blur-xl rounded-[1.5rem] p-0.5 border border-white/50 shadow-2xl overflow-hidden group-active:scale-95 transition-all">
                <div className="w-full h-full rounded-[1.3rem] bg-gradient-to-b from-slate-50 to-slate-200 overflow-hidden">
                  {/* Memoji Style 3D Face */}
                  <img 
                    src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent&scale=120" 
                    alt="Animated 3D Avatar"
                    className="w-full h-full object-cover scale-110 translate-y-1"
                  />
                </div>
              </div>
              {/* Floating Online Badge */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#DFFF00] border-2 border-white rounded-full shadow-lg z-20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <div className="bg-slate-50 w-8 h-8 rounded-lg flex items-center justify-center mb-3 text-slate-600">
            <LayoutGrid size={16} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">전체 캠페인</p>
          <p className="text-xl font-black">{totalCampaigns} <span className="text-xs font-bold text-slate-300 ml-1">건</span></p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm relative overflow-visible">
          <div className="bg-emerald-50 w-8 h-8 rounded-lg flex items-center justify-center mb-3 text-emerald-600">
            <CheckCircle2 size={16} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">완료된 캠페인</p>
          <p className="text-xl font-black text-emerald-600">
            {completedCampaigns} <span className="text-xs font-bold text-slate-300 ml-1">건</span>
          </p>
          
          {hasUnreadCompleted && (
            <div className="absolute -top-1 -right-1 flex items-center gap-1.5 bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-rose-200 border border-white animate-bounce">
              <span className="text-[8px] font-black uppercase">New</span>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 h-1 bg-emerald-400 transition-all duration-1000" style={{ width: `${(completedCampaigns/totalCampaigns)*100}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-black flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#A020F0] rounded-full" />
            나의 캠페인 리스트
          </h2>
          
          <div className="flex items-center gap-2 relative" ref={menuRef}>
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)} 
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                showSortMenu ? 'bg-black text-[#DFFF00]' : 'bg-white border border-slate-100 text-slate-400'
              }`}
            >
              <Menu size={18} />
            </button>
            {showSortMenu && (
              <div className="absolute top-10 right-0 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                <div className="px-4 py-2 border-b border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">정렬 기준</span>
                </div>
                {['rate', 'most', 'fewest', 'custom'].map((val) => (
                  <button 
                    key={val} 
                    onClick={() => { onSortChange(val as SortCriteria); setShowSortMenu(false); }} 
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className={sortCriteria === val ? 'text-[#A020F0]' : ''}>
                      {val === 'custom' ? '기본 순서' : val === 'rate' ? '완료율순' : val === 'most' ? '인사이트 많은순' : '인사이트 적은순'}
                    </span>
                    {sortCriteria === val && <Check size={16} className="text-[#A020F0]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
