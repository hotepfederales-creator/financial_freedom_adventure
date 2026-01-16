import React, { useState } from 'react';
import { RaidBattle } from './RaidBattle';
import { RaidBoss, RaidParticipant } from '../types/raidTypes';
import { Card } from './ui/Card';
import { Trophy, Shield } from 'lucide-react';

interface SocialRaidsProps {
  externalRaidData?: RaidBoss;
}

export const SocialRaids: React.FC<SocialRaidsProps> = ({ externalRaidData }) => {
  // Mock Data (Default)
  const defaultRaid: RaidBoss = {
    id: 'raid_1',
    name: 'The Student Loan Serpent',
    description: 'A massive snake made of promissory notes. It grows if left unchecked!',
    totalHp: 50000,
    currentHp: 32450,
    image: '🐍',
    deadline: '7 Days',
    difficulty: 'Hard'
  };

  const [squad, setSquad] = useState<RaidParticipant[]>([
    { id: 'p1', username: 'DebtSlayer99', damageDealt: 1200, avatar: '🧙‍♂️', lastActive: '2h ago' },
    { id: 'p2', username: 'FrugalFox', damageDealt: 850, avatar: '🦊', lastActive: '5m ago' },
    { id: 'p3', username: 'CoinMaster', damageDealt: 2100, avatar: '🤴', lastActive: '1d ago' },
  ]);

  const [isJoined, setIsJoined] = useState(false);

  // Use external data if provided (God Mode), otherwise use default/local
  const activeRaid = externalRaidData || defaultRaid;

  const handleJoin = () => {
    setIsJoined(true);
    setSquad([...squad, {
        id: 'me',
        username: 'You',
        damageDealt: 0,
        avatar: '🤠',
        lastActive: 'Just now'
    }]);
  };

  return (
    <div className="space-y-6">
       <Card className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white border-none shadow-xl">
          <div className="flex items-center gap-4">
             <div className="bg-yellow-500/20 p-4 rounded-full">
                <Trophy size={32} className="text-yellow-400" />
             </div>
             <div>
                <h2 className="text-2xl font-bold">Social Raid Battles</h2>
                <p className="text-slate-300">Team up with other trainers to pay down massive debt bosses. Strength in numbers!</p>
             </div>
          </div>
       </Card>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield size={20}/> Active Raid</h3>
             <RaidBattle 
                boss={activeRaid} 
                squad={squad} 
                isParticipating={isJoined}
                onJoin={handleJoin}
             />
          </div>

          <div className="space-y-6">
             <Card title="How it Works">
                <ul className="space-y-4 text-sm text-slate-600">
                    <li className="flex gap-3">
                        <span className="bg-indigo-100 text-indigo-700 font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">1</span>
                        <p>Debt is visualized as a <strong>Raid Boss</strong>. The Boss's HP is the total debt amount of the group (anonymized).</p>
                    </li>
                    <li className="flex gap-3">
                        <span className="bg-indigo-100 text-indigo-700 font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">2</span>
                        <p>When you log a <strong>Debt Repayment</strong> expense in your budget, it counts as "Damage" to the boss.</p>
                    </li>
                    <li className="flex gap-3">
                        <span className="bg-indigo-100 text-indigo-700 font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">3</span>
                        <p>Defeat the boss before the deadline to earn massive <strong>XP Rewards</strong> and rare badges.</p>
                    </li>
                </ul>
             </Card>

             <Card title="Upcoming Raids">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg opacity-60">
                        <span className="text-2xl">💳</span>
                        <div>
                            <p className="font-bold text-slate-700">Credit Card Golem</p>
                            <p className="text-xs text-slate-500">Starts in 3 days</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg opacity-60">
                        <span className="text-2xl">🚗</span>
                        <div>
                            <p className="font-bold text-slate-700">Auto Loan Autobot</p>
                            <p className="text-xs text-slate-500">Starts in 1 week</p>
                        </div>
                    </div>
                </div>
             </Card>
          </div>
       </div>
    </div>
  );
};