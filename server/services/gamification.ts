import { Types } from 'mongoose';
import { User } from '../models/User';
import { XPTransaction } from '../models/XPTransaction';
import { Notification } from '../models/Notification';

export const calculateLevel = (xp: number): number => {
  // Simple curve: Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 300 XP, Level N = N * (N-1) * 50
  let level = 1;
  while (xp >= level * (level + 1) * 50) {
    level++;
  }
  return level;
};

export const awardXP = async (
  studentId: string | Types.ObjectId, 
  amount: number, 
  reason: string, 
  sourceId: string
) => {
  try {
    // 1. Idempotency Check & Transaction Creation
    const tx = new XPTransaction({ studentId, amount, reason, sourceId });
    await tx.save(); // Will throw 11000 if duplicate

    // 2. Update User XP
    const user = await User.findById(studentId);
    if (!user) return;

    const previousLevel = user.level;
    user.xp += amount;
    const newLevel = calculateLevel(user.xp);

    user.level = newLevel;

    // 3. Level Up Logic
    if (newLevel > previousLevel) {
      // Trigger Notification
      const notif = new Notification({
        recipientId: studentId,
        recipientRole: 'STUDENT',
        type: 'LEVEL_UP',
        title: 'Level Up!',
        body: `Congratulations! You have reached Level ${newLevel}. Keep up the great work!`,
        deliveryChannels: ['IN_APP', 'PUSH']
      });
      await notif.save();
    }

    await user.save();
    return { success: true, newLevel, levelUp: newLevel > previousLevel };
  } catch (error: any) {
    if (error.code === 11000) {
      return { success: false, reason: 'XP already awarded for this action' };
    }
    throw error;
  }
};

export const updateStreak = async (studentId: string | Types.ObjectId) => {
  const user = await User.findById(studentId);
  if (!user) return;

  const today = new Date().toISOString().split('T')[0];
  
  if (user.lastStreakDate === today) {
    return user.currentStreak; // Already updated today
  }

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  if (user.lastStreakDate === yesterday) {
    user.currentStreak += 1;
  } else {
    user.currentStreak = 1; // Streak broken
  }

  if (user.currentStreak > user.longestStreak) {
    user.longestStreak = user.currentStreak;
  }

  user.lastStreakDate = today;
  
  if (user.currentStreak % 7 === 0) {
     // Trigger Notification for weekly streak
     const notif = new Notification({
      recipientId: studentId,
      recipientRole: 'STUDENT',
      type: 'STREAK',
      title: `${user.currentStreak} Day Streak!`,
      body: `You're on fire! You've logged in for ${user.currentStreak} consecutive days.`,
      deliveryChannels: ['IN_APP', 'PUSH']
    });
    await notif.save();
  }

  await user.save();
  return user.currentStreak;
};
