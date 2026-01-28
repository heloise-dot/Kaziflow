import client from '../src/api/client';
import { RiskScore } from '../types';

export const getRiskScoreForVendor = async (vendorData: any): Promise<RiskScore> => {
  try {
    // In a real scenario, we might pass the vendor ID differently
    // For this prototype, we're using a mock ID or extracting it from data
    const vendorId = vendorData.id || "mock-vendor-id";

    // Fixed template literal syntax
    const response = await client.post(`/risk/analyze/${vendorId}`, vendorData);
    return response.data;
  } catch (error) {
    console.error("AI Risk Scoring Failed:", error);
    // Fallback safe score if backend fails (e.g. while server is down)
    return {
      score: 75,
      level: 'Medium',
      reasoning: "Backend analysis unavailable. Using baseline data.",
      factors: [{ label: "Baseline Consistency", impact: 0.5 }]
    };
  }
};
