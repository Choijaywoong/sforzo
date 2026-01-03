
import React from 'react';
import { Sparkles, Coins, TrendingUp, ChevronRight, FireExtinguisher } from 'lucide-react';
import { Campaign } from '../types';

interface UserFeedProps {
  campaigns: Campaign[];
  onParticipate: (campaign: Campaign) => void;
  userPoints: number;
  mode: 'all' | 'hot';
}

const UserFeed: React.FC<UserFeedProps> = ({ campaigns, onParticipate, userPoints, mode }) => {
  const displayCampaigns = mode === 'hot' 
    ? campaigns.filter(c => c.isHot) 
    : campaigns;

  const hotCampaign = campaigns.find(c => c.isHot);

  return (
    <div className="p-4 space-y-6 pb-32">
      {/* User Header */}
      <header className="flex justify-between items-center pt-2">
        <div className="space-y-1">
          <p className="text-[#A020F0] text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            {mode === 'all' ? 'Earn with Pick-it' : 'Popular now'}
          </p>
          <h1 className="text-3xl font-black tracking-tight leading-tight">
            {mode === 'all' ? (
              <>오늘의 <span className="text-[#A020F0]">Pick</span>으로<br/>수익을 만드세요! 💸</>
            ) : (
              <>지금 가장 <span className="text-[#DFFF00] bg-black px-2 py-0.5 rounded-lg italic">HOT</span>한<br/>리워드 캠페인 🔥</>
            )}
          </h1>
        </div>
        
        {/* Points Display - Only in Feed */}
        {mode === 'all' && (
          <div className="bg-black text-[#DFFF00] px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/10 active:scale-95 transition-transform">
            <Coins size={16} />
            <span className="font-black text-sm">{userPoints.toLocaleString()}P</span>
          </div>
        )}
      </header>

      {/* Featured Campaign - Only in 'all' mode */}
      {mode === 'all' && hotCampaign && (
        <div className="relative group overflow-hidden rounded-[2.5rem] bg-black aspect-[4/5] shadow-2xl animate-in fade-in duration-700">
          <img 
            src={hotCampaign.thumbnailA} 
            className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
            alt="Featured"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-[#DFFF00] text-black w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3 flex items-center gap-1">
              <Sparkles size={10} /> Hot Campaign
            </div>
            <h2 className="text-white text-3xl font-black mb-4 leading-tight">{hotCampaign.title}</h2>
            <button 
              onClick={() => onParticipate(hotCampaign)}
              className="w-full bg-white py-4 rounded-2xl text-black font-black flex items-center justify-center gap-2 hover:bg-[#DFFF00] transition-colors"
            >
              지금 참여하고 최대 {hotCampaign.rewardLight + hotCampaign.rewardDeep}P 받기
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Campaign List */}
      <div className="space-y-4">
        <h3 className="text-lg font-black px-1 flex items-center gap-2">
          {mode === 'all' ? (
            <><TrendingUp size={20} className="text-[#A020F0]" />전체 캠페인</>
          ) : (
            <><Sparkles size={20} className="text-[#DFFF00]" />실시간 랭킹</>
          )}
        </h3>
        <div className="grid gap-4">
          {displayCampaigns.map((c, idx) => (
            <div 
              key={c.id} 
              onClick={() => onParticipate(c)}
              className={`bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group animate-in slide-in-from-bottom duration-500`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative shrink-0">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden relative">
                  <img src={c.thumbnailA} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                {mode === 'hot' && (
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-black text-[#DFFF00] rounded-full flex items-center justify-center font-black italic shadow-lg">
                    {idx + 1}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {c.isHot && <span className="text-[8px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded-sm uppercase">Hot</span>}
                  <h4 className="font-black text-slate-800 truncate">{c.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400">참여 {c.totalVotes}명</span>
                  <div className="w-1 h-1 bg-slate-200 rounded-full" />
                  <span className="text-[10px] font-black text-[#A020F0]">최대 {(c.rewardLight + c.rewardDeep).toLocaleString()}P</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-[#A020F0] group-hover:text-white transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          ))}
          {displayCampaigns.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-bold">참여 가능한 핫 캠페인이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFeed;
