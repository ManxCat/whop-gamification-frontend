import React, { useState, useEffect } from 'react';
import { Trophy, Star, TrendingUp, Award, Zap, Users, MessageCircle, Calendar, Gift, Settings, LogOut } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'https://whop-gamification-backend.onrender.com';

const WhopRetentionApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);

  // Initialize app and fetch data from backend
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for token in URL (after OAuth redirect)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          // Store token in sessionStorage
          sessionStorage.setItem('auth_token', token);
          
          // Remove token from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Fetch user data from backend
          const response = await fetch(`${API_URL}/api/user/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser({
              id: userData.id,
              username: userData.username,
              email: userData.email,
              level: userData.level,
              xp: userData.xp,
              xpToNextLevel: userData.xpToNextLevel,
              totalPoints: userData.totalPoints,
              streak: userData.streak,
              rank: userData.rank,
              achievements: userData.achievements,
              joinedDate: userData.joinedDate
            });
            
            // Fetch additional data
            await fetchAllData(token);
          }
        } else {
          // Check if token exists in sessionStorage
          const storedToken = sessionStorage.getItem('auth_token');
          if (storedToken) {
            // Fetch user data with stored token
            const response = await fetch(`${API_URL}/api/user/profile`, {
              headers: {
                'Authorization': `Bearer ${storedToken}`
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              setUser({
                id: userData.id,
                username: userData.username,
                email: userData.email,
                level: userData.level,
                xp: userData.xp,
                xpToNextLevel: userData.xpToNextLevel,
                totalPoints: userData.totalPoints,
                streak: userData.streak,
                rank: userData.rank,
                achievements: userData.achievements,
                joinedDate: userData.joinedDate
              });
              
              await fetchAllData(storedToken);
            } else {
              // Token invalid, clear it
              sessionStorage.removeItem('auth_token');
            }
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Initialization error:', error);
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);

  // Fetch all data from backend
  const fetchAllData = async (token) => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Fetch achievements
      const achievementsRes = await fetch(`${API_URL}/api/achievements`, { headers });
      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json();
        setAchievements(achievementsData);
      }
      
      // Fetch leaderboard
      const leaderboardRes = await fetch(`${API_URL}/api/leaderboard`, { headers });
      if (leaderboardRes.ok) {
        const leaderboardData = await leaderboardRes.json();
        setLeaderboard(leaderboardData);
      }
      
      // Fetch daily tasks
      const tasksRes = await fetch(`${API_URL}/api/tasks/daily`, { headers });
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setDailyTasks(tasksData);
      }
      
      // Fetch rewards
      const rewardsRes = await fetch(`${API_URL}/api/rewards`, { headers });
      if (rewardsRes.ok) {
        const rewardsData = await rewardsRes.json();
        setRewards(rewardsData);
      }
      
      // Fetch activity feed
      const activityRes = await fetch(`${API_URL}/api/activity`, { headers });
      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setActivityFeed(activityData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRedeemReward = async (rewardId) => {
    if (!user) return;
    
    const token = sessionStorage.getItem('auth_token');
    const reward = rewards.find(r => r.id === rewardId);
    
    if (user.totalPoints >= reward.cost) {
      try {
        const response = await fetch(`${API_URL}/api/rewards/redeem`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rewardId })
        });
        
        if (response.ok) {
          alert(`🎉 Successfully redeemed: ${reward.name}!\n\nYour reward will be processed shortly.`);
          // Refresh user data
          await fetchAllData(token);
        } else {
          const error = await response.json();
          alert(`Failed to redeem: ${error.error}`);
        }
      } catch (error) {
        console.error('Error redeeming reward:', error);
        alert('Failed to redeem reward. Please try again.');
      }
    }
  };

  const handleCompleteTask = async (taskId) => {
    const token = sessionStorage.getItem('auth_token');
    
    try {
      const response = await fetch(`${API_URL}/api/tasks/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskId })
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`✅ Task completed! +${result.xpEarned} XP earned`);
        // Refresh data
        await fetchAllData(token);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    setUser(null);
    window.location.reload();
  };

  const handleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_URL}/auth/callback?code=test_code`;
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
            onClick={handleLogin}
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
      {activityFeed.length > 0 ? (
        activityFeed.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {item.activity_type === 'level_up' ? '⬆️' : 
                 item.activity_type === 'achievement' ? '🏆' :
                 item.activity_type === 'task' ? '✅' : '📝'}
              </span>
              <div>
                <p className="font-medium text-gray-800">{item.description}</p>
                <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
              </div>
            </div>
            <span className="text-green-600 font-semibold">+{item.xp_earned} XP</span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-8">No activity yet. Complete tasks to get started!</p>
      )}
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
                      {task.progress !== undefined && task.progress !== null && (
                        <div className="ml-9">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 transition-all"
                              style={{ width: `${(task.progress / task.required_count) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{task.progress} / {task.required_count}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold ${task.completed ? 'text-green-600' : 'text-purple-600'}`}>
                        +{task.xp_reward} XP
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
                    <p className="text-sm text-gray-600 mb-2">{ach.description}</p>
                    <span className={`text-sm font-semibold ${ach.unlocked ? 'text-purple-600' : 'text-gray-500'}`}>
                      {ach.unlocked ? '✓ ' : ''}{ach.xp_reward} XP
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
                    member.is_user 
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300' 
                      : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-400 w-8">{member.rank}</span>
                      <span className="text-2xl">{member.badge}</span>
                      <div>
                        <p className={`font-bold ${member.is_user ? 'text-purple-700' : 'text-gray-800'}`}>
                          {member.username}
                        </p>
                        <p className="text-sm text-gray-600">Level {member.level}</p>
                      </div>
                    </div>
                    <span className="font-bold text-purple-600">{member.total_points.toLocaleString()}</span>
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
                      disabled={!reward.available || user.totalPoints < reward.cost || reward.redeemed}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        reward.redeemed 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : reward.available && user.totalPoints >= reward.cost
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {reward.redeemed ? 'Already Redeemed' : user.totalPoints >= reward.cost ? 'Redeem Now' : 'Not Enough Points'}
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
