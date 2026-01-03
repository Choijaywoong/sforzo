
import React, { useState, useRef } from 'react';
import { Sparkles, Coins, ChevronUp, Check, MessageCircle, ArrowUp } from 'lucide-react';
import { Campaign } from '../types';

interface UserReelFeedProps {
  campaigns: Campaign[];
  onParticipate: (campaign: Campaign, selection: 'A' | 'B') => void;
  userPoints: number;
}

const ReelItem: React.FC<{ campaign: Campaign; onParticipate: (campaign: Campaign, selection: 'A' | 'B') => void }> = ({ campaign, onParticipate }) => {
  const [voted, setVoted] = useState<'A' | 'B' | null>(null);

  const handleSelect = (side: 'A' | 'B') => {
    setVoted(side);
    // 선택한 side 정보를 담아 팝업 호출
    setTimeout(() => {
      onParticipate(campaign, side);
    }, 400);
  };

  return (
    <div className="relative w-full h-full snap-start bg-black overflow-hidden flex flex-col">
      {/* Background Images Split */}
      <div className="flex-1 flex w-full relative">
        <div 
          onClick={() => handleSelect('A')}
          className={`relative flex-1 h-full overflow-hidden transition-all duration-500 cursor-pointer ${voted === 'B' ? 'opacity-30' : 'opacity-100'}`}
        >
          <img src={campaign.thumbnailA} className="w-full h-full object-cover" alt="A" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl w-16 h-16 rounded-full flex items-center justify-center font-black text-3xl text-white border-2 border-white/50 shadow-2xl">A</div>
          {voted === 'A' && (
            <div className="absolute inset-0 bg-[#DFFF00]/30 flex items-center justify-center animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-[#DFFF00] rounded-full flex items-center justify-center text-black shadow-[0_0_30px_#DFFF00]"><Check size={48} strokeWidth={4} /></div>
            </div>
          )}
        </div>
        
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/20 backdrop-blur-sm z-10" />

        <div 
          onClick={() => handleSelect('B')}
          className={`relative flex-1 h-full overflow-hidden transition-all duration-500 cursor-pointer ${voted === 'A' ? 'opacity-30' : 'opacity-100'}`}
        >
          <img src={campaign.thumbnailB} className="w-full h-full object-cover" alt="B" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl w-16 h-16 rounded-full flex items-center justify-center font-black text-3xl text-white border-2 border-white/50 shadow-2xl">B</div>
          {voted === 'B' && (
            <div className="absolute inset-0 bg-[#DFFF00]/30 flex items-center justify-center animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-[#DFFF00] rounded-full flex items-center justify-center text-black shadow-[0_0_30px_#DFFF00]"><Check size={48} strokeWidth={4} /></div>
            </div>
          )}
        </div>
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#DFFF00] text-black text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">Hot Pick</span>
            <div className="flex items-center gap-1.5 text-[#DFFF00]">
              <Coins size={14} />
              <span className="text-xs font-black">최대 {(campaign.rewardLight + campaign.rewardDeep).toLocaleString()}P</span>
            </div>
          </div>
          <h2 className="text-white text-2xl font-black leading-tight drop-shadow-lg">{campaign.title}</h2>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-slate-400 overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${campaign.id + i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-xs font-bold">{campaign.totalVotes.toLocaleString()}명이 고민 중...</p>
          </div>
        </div>
      </div>

      {/* Navigation Hint */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-6 z-20">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-[#DFFF00] border border-white/20">
            <Sparkles size={20} />
          </div>
          <span className="text-[10px] text-white font-black">Top</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
            <MessageCircle size={20} />
          </div>
          <span className="text-[10px] text-white font-black">{campaign.insightCount}</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <ArrowUp className="text-white" size={20} />
      </div>
    </div>
  );
};

const UserReelFeed: React.FC<UserReelFeedProps> = ({ campaigns, onParticipate }) => {
  const reelCampaigns = campaigns.filter(c => c.isHot || c.status === 'active');

  return (
    <div className="fixed inset-0 z-0 bg-black h-screen w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth no-scrollbar">
      {reelCampaigns.map((c) => (
        <ReelItem key={c.id} campaign={c} onParticipate={onParticipate} />
      ))}
      
      {reelCampaigns.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-white p-8 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mb-6">
            <Sparkles size={40} className="text-[#DFFF00]" />
          </div>
          <h2 className="text-xl font-black mb-2">새로운 질문을 불러오는 중...</h2>
          <p className="text-slate-500 font-bold">더 많은 셀러들이 캠페인을 준비하고 있어요!</p>
        </div>
      )}
    </div>
  );
};

export default UserReelFeed;
