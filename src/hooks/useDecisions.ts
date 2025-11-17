import { useState, useEffect, useCallback } from 'react';
import {
  Decision,
  CreateDecisionInput,
  UpdateDecisionInput,
  DecisionOutcome,
  DecisionFilter,
} from '../types/decision';
import { decisionsService } from '../services/decisions';

export function useDecisions(filter: DecisionFilter = 'all') {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDecisions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await decisionsService.getFiltered(filter);
      setDecisions(data);
    } catch (err) {
      setError('Failed to load decisions');
      console.error('Error loading decisions:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadDecisions();
  }, [loadDecisions]);

  const createDecision = useCallback(
    async (input: CreateDecisionInput): Promise<Decision | null> => {
      try {
        const newDecision = await decisionsService.create(input);
        await loadDecisions();
        return newDecision;
      } catch (err) {
        setError('Failed to create decision');
        console.error('Error creating decision:', err);
        return null;
      }
    },
    [loadDecisions]
  );

  const updateDecision = useCallback(
    async (id: string, input: UpdateDecisionInput): Promise<Decision | null> => {
      try {
        const updated = await decisionsService.update(id, input);
        await loadDecisions();
        return updated;
      } catch (err) {
        setError('Failed to update decision');
        console.error('Error updating decision:', err);
        return null;
      }
    },
    [loadDecisions]
  );

  const deleteDecision = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const success = await decisionsService.delete(id);
        if (success) {
          await loadDecisions();
        }
        return success;
      } catch (err) {
        setError('Failed to delete decision');
        console.error('Error deleting decision:', err);
        return false;
      }
    },
    [loadDecisions]
  );

  const addOutcome = useCallback(
    async (
      id: string,
      outcome: Omit<DecisionOutcome, 'reviewedAt'>
    ): Promise<Decision | null> => {
      try {
        const updated = await decisionsService.addOutcome(id, outcome);
        await loadDecisions();
        return updated;
      } catch (err) {
        setError('Failed to add outcome');
        console.error('Error adding outcome:', err);
        return null;
      }
    },
    [loadDecisions]
  );

  const archiveDecision = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const updated = await decisionsService.archive(id);
        if (updated) {
          await loadDecisions();
          return true;
        }
        return false;
      } catch (err) {
        setError('Failed to archive decision');
        console.error('Error archiving decision:', err);
        return false;
      }
    },
    [loadDecisions]
  );

  return {
    decisions,
    loading,
    error,
    refresh: loadDecisions,
    createDecision,
    updateDecision,
    deleteDecision,
    addOutcome,
    archiveDecision,
  };
}
