import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../services/storage';

const FREE_TIER_LIMIT = 30;

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    try {
      const status = await storage.getItem<boolean>(STORAGE_KEYS.PREMIUM_STATUS);
      setIsPremium(status || false);
    } catch (error) {
      console.error('Error loading premium status:', error);
    } finally {
      setLoading(false);
    }
  };

  const setPremiumStatus = async (status: boolean) => {
    try {
      await storage.setItem(STORAGE_KEYS.PREMIUM_STATUS, status);
      setIsPremium(status);
    } catch (error) {
      console.error('Error setting premium status:', error);
    }
  };

  const canCreateDecision = async (): Promise<boolean> => {
    if (isPremium) {
      return true;
    }

    // Check decision count for free tier
    const { decisionsService } = await import('../services/decisions');
    const count = await decisionsService.getCount();
    return count < FREE_TIER_LIMIT;
  };

  return {
    isPremium,
    loading,
    freeTierLimit: FREE_TIER_LIMIT,
    setPremiumStatus,
    canCreateDecision,
  };
}
