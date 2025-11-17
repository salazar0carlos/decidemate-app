import { v4 as uuidv4 } from 'uuid';
import {
  Decision,
  CreateDecisionInput,
  UpdateDecisionInput,
  DecisionOutcome,
  DecisionFilter,
} from '../types/decision';
import { storage, STORAGE_KEYS } from './storage';

// CRUD operations for decisions
export const decisionsService = {
  // Get all decisions
  async getAll(): Promise<Decision[]> {
    const decisions = await storage.getItem<Decision[]>(STORAGE_KEYS.DECISIONS);
    if (!decisions) {
      return [];
    }

    // Convert date strings back to Date objects
    return decisions.map(decision => ({
      ...decision,
      createdAt: new Date(decision.createdAt),
      updatedAt: new Date(decision.updatedAt),
      reviewDate: new Date(decision.reviewDate),
      outcome: decision.outcome ? {
        ...decision.outcome,
        reviewedAt: new Date(decision.outcome.reviewedAt),
      } : undefined,
    }));
  },

  // Get decision by ID
  async getById(id: string): Promise<Decision | null> {
    const decisions = await this.getAll();
    return decisions.find(d => d.id === id) || null;
  },

  // Create new decision
  async create(input: CreateDecisionInput): Promise<Decision> {
    const decisions = await this.getAll();

    const newDecision: Decision = {
      ...input,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    decisions.push(newDecision);
    await storage.setItem(STORAGE_KEYS.DECISIONS, decisions);

    return newDecision;
  },

  // Update existing decision
  async update(id: string, input: UpdateDecisionInput): Promise<Decision | null> {
    const decisions = await this.getAll();
    const index = decisions.findIndex(d => d.id === id);

    if (index === -1) {
      return null;
    }

    const updatedDecision: Decision = {
      ...decisions[index],
      ...input,
      updatedAt: new Date(),
    };

    decisions[index] = updatedDecision;
    await storage.setItem(STORAGE_KEYS.DECISIONS, decisions);

    return updatedDecision;
  },

  // Delete decision
  async delete(id: string): Promise<boolean> {
    const decisions = await this.getAll();
    const filtered = decisions.filter(d => d.id !== id);

    if (filtered.length === decisions.length) {
      return false; // Decision not found
    }

    await storage.setItem(STORAGE_KEYS.DECISIONS, filtered);
    return true;
  },

  // Add outcome to decision
  async addOutcome(id: string, outcome: Omit<DecisionOutcome, 'reviewedAt'>): Promise<Decision | null> {
    const decisions = await this.getAll();
    const index = decisions.findIndex(d => d.id === id);

    if (index === -1) {
      return null;
    }

    const updatedDecision: Decision = {
      ...decisions[index],
      outcome: {
        ...outcome,
        reviewedAt: new Date(),
      },
      updatedAt: new Date(),
    };

    decisions[index] = updatedDecision;
    await storage.setItem(STORAGE_KEYS.DECISIONS, decisions);

    return updatedDecision;
  },

  // Get filtered decisions
  async getFiltered(filter: DecisionFilter): Promise<Decision[]> {
    const decisions = await this.getAll();
    const now = new Date();

    switch (filter) {
      case 'pending':
        return decisions.filter(d => !d.outcome && !d.isArchived);
      case 'reviewed':
        return decisions.filter(d => d.outcome && !d.isArchived);
      case 'archived':
        return decisions.filter(d => d.isArchived);
      case 'all':
      default:
        return decisions.filter(d => !d.isArchived);
    }
  },

  // Get decisions due for review
  async getDueForReview(): Promise<Decision[]> {
    const decisions = await this.getAll();
    const now = new Date();

    return decisions.filter(d => {
      if (d.outcome || d.isArchived) {
        return false;
      }
      return d.reviewDate <= now;
    });
  },

  // Archive decision
  async archive(id: string): Promise<Decision | null> {
    return this.update(id, { isArchived: true });
  },

  // Unarchive decision
  async unarchive(id: string): Promise<Decision | null> {
    return this.update(id, { isArchived: false });
  },

  // Get count of decisions (for premium limit)
  async getCount(): Promise<number> {
    const decisions = await this.getAll();
    return decisions.filter(d => !d.isArchived).length;
  },

  // Clear all decisions (for settings)
  async clearAll(): Promise<boolean> {
    return await storage.setItem(STORAGE_KEYS.DECISIONS, []);
  },

  // Export decisions as JSON
  async exportToJSON(): Promise<string> {
    const decisions = await this.getAll();
    return JSON.stringify(decisions, null, 2);
  },

  // Import decisions from JSON
  async importFromJSON(jsonString: string): Promise<boolean> {
    try {
      const imported = JSON.parse(jsonString) as Decision[];
      const existing = await this.getAll();

      // Merge with existing, avoiding duplicates
      const allDecisions = [...existing];
      imported.forEach(importedDecision => {
        if (!allDecisions.find(d => d.id === importedDecision.id)) {
          allDecisions.push(importedDecision);
        }
      });

      await storage.setItem(STORAGE_KEYS.DECISIONS, allDecisions);
      return true;
    } catch (error) {
      console.error('Error importing decisions:', error);
      return false;
    }
  },
};
