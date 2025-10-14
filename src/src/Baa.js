import React, { useState, useEffect } from 'react';
import { Trophy, Star, TrendingUp, Award, Zap, Users, MessageCircle, Calendar, Gift, Settings, LogOut } from 'lucide-react';

const WhopRetentionApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Simulate Whop OAuth and data fetching
  useEffect(() => {
    // In production, this would call your backend API
    const initializeApp = async () => {
      try {
        // Check for Whop OAuth token in URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          // Exchange code for access token via your backend
          console.log('OAuth code received:', code);
        }
        
        // Simulate fetching user data from your backend
        setTimeout(() => {
          setUser({
            id: 'whop_user_123',
            username: 'Alex_Dev',
            email: 'alex@example.com',
            whopMemberId: 'mem_123456',
            level: 12,
            xp: 2340,
            xpToNextLevel: 3000,
            totalPoints: 15420,
            streak: 7,
            rank: 23,
            achievements: 18,
            joinedDate: '2024-08-15'
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Initialization error:', error);
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);

  const [achievements] = useState([
    { id: 1, name: 'First Steps', desc: 'Join the community', icon: '🎯', unlocked: true, xp: 100, category: 'onboarding' },
    { id: 2, name: 'Chatterbox', desc: 'Send 50 messages', icon: '💬', unlocked: true, xp: 250, category: 'engagement' },
    { id: 3, name: 'Week Warrior', desc: '7 day streak', icon: '🔥', unlocked: true, xp: 500, category: 'consistency' },
    { id: 4, name: 'Helpful Hand', desc: 'Help 10 members', icon: '🤝', unlocked: true, xp: 300, category: 'community' },
    { id: 5, name: 'Content King', desc: 'Create 25 posts', icon: '👑', unlocked: false, xp: 750, category: 'content' },
    { id: 6, name: 'Month Master', desc: '30 day streak', icon: '⚡', unlocked: false, xp: 1000, category: 'consistency' },
    { id: 7, name: 'Super Supporter', desc: 'React to 100 posts', icon: '❤️', unlocked: false, xp: 400, category: 'engagement' },
    { id: 8, name: 'Early Bird', desc: 'First to comment 20 times', icon: '🐦', unlocked: false, xp: 600, category: 'engagement' }
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: 'Sarah_Pro', points: 28450, level: 18, badge: '👑', whopId: 'mem_001' },
    { rank: 2, name: 'Mike_Trader', points: 24120, level: 16, badge: '🥈', whopId: 'mem_002' },
    { rank: 3, name: 'Lisa_Growth', points: 19870, level: 15, badge: '🥉', whopId: 'mem_003' },
    { rank: 23, name: 'Alex_Dev', points: 15420, level: 12, badge: '⭐', isUser: true, whopId: 'mem_123456' },
    { rank: 24, name: 'Tom_Builder', points: 15100, level: 12, badge: '⭐', whopId: 'mem_024' },
    { rank: 25, name: 'Emma_Creator', points: 14890, level: 11, badge: '⭐', whopId: 'mem_025' }
  ]);

  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, name: 'Check in daily', xp: 50, completed: true, type: 'daily_login' },
    { id: 2, name: 'Send 5 messages', xp: 100, completed: true, progress: 5, total: 5, type: 'send_messages' },
    { id: 3, name: 'React to 10 posts', xp: 75, completed: false, progress: 6, total: 10, type: 'react_posts' },
    { id: 4, name: 'Create 1 post', xp: 150, completed: false, progress: 0, total: 1, type: 'create_post' }
  ]);

  const [rewards] = useState([
    { id: 1, name: 'Exclusive Discord Role', cost: 5000, icon: '🎭', available: true, type: 'role' },
    { id: 2, name: '1-on-1 Mentorship Call', cost: 10000, icon: '📞', available: true, type: 'call' },
    { id: 3, name: 'Early Access Feature', cost: 7500, icon: '🚀', available: true, type: 'access' },
    { id: 4, name: 'Community Shoutout', cost: 3000, icon: '📢', available: true, type: 'shoutout' },
    { id: 5, name: 'Custom Badge', cost: 15000, icon: '🏆', available: false, type: 'badge' },
    { id: 6, name: 'Free Month Access', cost: 20000, icon: '💎', available: true, type: 'subscription' }
  ]);

  const handleRedeemReward = async (rewardId) => {
    if (!user) return;
    
    const reward = rewards.find(r => r.id === rewardId);
    if (user.totalPoints >= reward.cost) {
      // In production, call your backend API
      console.log('Redeeming reward:', reward);
      alert(`🎉 Successfully redeemed: ${reward.name}!\n\nYour reward will be processed shortly.`);
      
      // Would update user points via API
      // await fetch('/api/rewards/redeem', { method: 'POST', body: JSON.stringify({ rewardId }) });
    }
  };

  const handleCompleteTask = async (taskId) => {
    // In production, this would verify completion via your backend
    console.log('Completing task:', taskId);
    setDailyTasks(tasks => 
      tasks.map(task => 
        task.id === taskId ? { ...task, completed: true, progress: task.total } : task
      )
    );
  };

  const handleLogout = () => {
    // Clear session and redirect to Whop
    window.location.href = 'https://whop.com';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your gamification data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Gamification Hub</h1>
          <p className="text-gray-600 mb-8">Level up your community engagement and earn exclusive rewards</p>
          <button 
            onClick={() => {
              // In production, redirect to Whop OAuth
              const clientId = 'YOUR_WHOP_CLIENT_ID';
              const redirectUri = encodeURIComponent(window.location.origin);
              window.location.href = `https://whop.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=user:read community:read`;
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-all"
          >
            Connect with Whop
          </button>
          <p className="text-xs text-gray-500 mt-4">Secure authentication via Whop OAuth</p>
        </div>
      </div>
    );
  }

  const progressPercent = (user.xp / user.xpToNextLevel) * 100;

  const ActivityFeed = () => (
    <div className="space-y-3">
      {[
        { action: 'Completed "Week Warrior" achievement', xp: 500, time: '2 hours ago', icon: '🔥' },
        { action: 'Reached Level 12', xp: 1000, time: '1 day ago', icon: '⬆️' },
        { action: 'Helped a community member', xp: 150, time: '2 days ago', icon: '🤝' },
        { action: 'Posted valuable content', xp: 200, time: '3 days ago', icon: '📝' },
        { action: 'Completed daily check-in', xp: 50, time: '4 days ago', icon: '✅' }
      ].map((item, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-medium text-gray-800">{item.action}</p>
              <p className="text-sm text-gray-500">{item.time}</p>
            </div>
          </div>
          <span className="text-green-600 font-semibold">+{item.xp} XP</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Gamification Hub</h1>
              <p className="text-gray-600">Powered by Whop</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Streak</p>
                <p className="text-2xl font-bold text-orange-500">{user.streak} 🔥</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* User Stats */}
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl text-white font-bold">
              {user.username.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  Level {user.level}
                </span>
              </div>
              <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {user.xp} / {user.xpToNextLevel} XP to Level {user.level + 1}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
              <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-700">{user.totalPoints.toLocaleString()}</p>
              <p className="text-xs text-purple-600">Total Points</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
              <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">{user.achievements}</p>
              <p className="text-xs text-blue-600">Achievements</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
              <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-700">#{user.rank}</p>
              <p className="text-xs text-orange-600">Global Rank</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
              <Zap className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{user.streak}</p>
              <p className="text-xs text-green-600">Day Streak</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
            { id: 'tasks', name: 'Daily Tasks', icon: Calendar },
            { id: 'achievements', name: 'Achievements', icon: Award },
            { id: 'leaderboard', name: 'Leaderboard', icon: Trophy },
            { id: 'rewards', name: 'Rewards', icon: Gift }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>
              <ActivityFeed />
              
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
                <h4 className="font-bold text-gray-800 mb-2">🎯 Keep Your Streak Going!</h4>
                <p className="text-gray-600 mb-4">You're on a {user.streak} day streak. Complete your daily tasks to maintain it!</p>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  View Tasks
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Daily Tasks</h3>
              <p className="text-gray-600 mb-6">Complete tasks to earn XP and maintain your streak</p>
              <div className="space-y-3">
                {dailyTasks.map(task => (
                  <div key={task.id} className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                    task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}>
                          {task.completed && <span className="text-white text-sm">✓</span>}
                        </div>
                        <span className={`font-medium ${task.completed ? 'text-green-700' : 'text-gray-700'}`}>
                          {task.name}
                        </span>
                      </div>
                      {task.progress !== undefined && (
                        <div className="ml-9">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 transition-all"
                              style={{ width: `${(task.progress / task.total) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{task.progress} / {task.total}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold ${task.completed ? 'text-green-600' : 'text-purple-600'}`}>
                        +{task.xp} XP
                      </span>
                      {!task.completed && (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Achievements</h3>
              <p className="text-gray-600 mb-6">Unlock achievements to earn bonus XP</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map(ach => (
                  <div key={ach.id} className={`p-6 rounded-xl border-2 text-center transition-all ${
                    ach.unlocked 
                      ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-md' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}>
                    <div className="text-5xl mb-3">{ach.icon}</div>
                    <h4 className="font-bold text-gray-800 mb-1">{ach.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{ach.desc}</p>
                    <span className={`text-sm font-semibold ${ach.unlocked ? 'text-purple-600' : 'text-gray-500'}`}>
                      {ach.unlocked ? '✓ ' : ''}{ach.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Community Leaderboard</h3>
              <p className="text-gray-600 mb-6">Compete with other members for the top spot</p>
              <div className="space-y-2">
                {leaderboard.map(member => (
                  <div key={member.rank} className={`flex items-center justify-between p-4 rounded-xl ${
                    member.isUser 
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300' 
                      : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-400 w-8">{member.rank}</span>
                      <span className="text-2xl">{member.badge}</span>
                      <div>
                        <p className={`font-bold ${member.isUser ? 'text-purple-700' : 'text-gray-800'}`}>
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-600">Level {member.level}</p>
                      </div>
                    </div>
                    <span className="font-bold text-purple-600">{member.points.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Redeem Rewards</h3>
              <p className="text-gray-600 mb-2">Spend your points on exclusive rewards</p>
              <p className="text-sm text-purple-600 font-semibold mb-6">Available Balance: {user.totalPoints.toLocaleString()} points</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map(reward => (
                  <div key={reward.id} className={`p-6 rounded-xl border-2 ${
                    reward.available && user.totalPoints >= reward.cost
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-4xl mb-2">{reward.icon}</div>
                        <h4 className="font-bold text-gray-800 mb-1">{reward.name}</h4>
                        <p className="text-lg font-bold text-purple-600">{reward.cost.toLocaleString()} points</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRedeemReward(reward.id)}
                      disabled={!reward.available || user.totalPoints < reward.cost}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        reward.available && user.totalPoints >= reward.cost
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {user.totalPoints >= reward.cost ? 'Redeem Now' : 'Not Enough Points'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhopRetentionApp;
