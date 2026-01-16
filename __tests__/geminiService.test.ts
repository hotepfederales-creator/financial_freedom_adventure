import { getBudgetAnalysis, getTaxEstimate, getChatResponse } from '../services/geminiService';

// Declarations for Jest globals to satisfy TypeScript compiler
declare const jest: any;
declare const describe: any;
declare const beforeEach: any;
declare const test: any;
declare const expect: any;

// Mock global fetch
global.fetch = jest.fn();

describe('FinMon Verification Suite', () => {
  beforeEach(() => {
    (global.fetch as any).mockClear();
  });

  // --- 1. Functional Testing: Logic Check ---
  
  test('Functional: getBudgetAnalysis returns structured data', async () => {
    const mockResponse = {
      healthScore: 85,
      summary: "It's super effective!",
      recommendations: ["Buy less coffee"],
      savingsPotential: 100
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const mockTransactions = [{ id: '1', amount: 50, category: 'Food', type: 'expense', date: '2023-01-01' }];
    // @ts-ignore
    const result = await getBudgetAnalysis(5000, mockTransactions);
    
    expect(result.healthScore).toBe(85);
    expect(result.summary).toBe("It's super effective!");
    expect(global.fetch).toHaveBeenCalledWith('/api/finmon-agent', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('analyze_budget')
    }));
  });

  test('Functional: getTaxEstimate handles inputs correctly', async () => {
    const mockTaxResponse = {
      estimatedTax: 15000,
      effectiveRate: 0.15,
      takeHomePay: 85000,
      bracket: "22%",
      tips: ["Maximize 401k"]
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTaxResponse
    });

    const result = await getTaxEstimate(100000, "California", "Single");
    
    expect(result.estimatedTax).toBe(15000);
    expect(result.bracket).toBe("22%");
    expect(global.fetch).toHaveBeenCalledWith('/api/finmon-agent', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('estimate_tax')
    }));
  });

  // --- 2. Resilience Testing: API Failures ---

  test('Resilience: getBudgetAnalysis handles Server 500 gracefully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    // @ts-ignore
    const result = await getBudgetAnalysis(5000, []);
    
    // Should return default safe object, not crash
    expect(result.healthScore).toBe(0);
    expect(result.summary).toContain("malfunctioning"); 
  });

  test('Resilience: getChatResponse handles Network Error gracefully', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error("Network Error"));

    const result = await getChatResponse([], "Hello");
    
    expect(result).toContain("A wild error appeared");
  });

  // --- 3. System Testing: Persona Integrity (Mocked) ---
  // We check that the 'level' parameter is passed, which triggers the persona logic on the backend.
  test('System: getChatResponse passes userLevel for persona generation', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Hello Rookie." })
    });

    await getChatResponse([], "Hi", 1);

    expect(global.fetch).toHaveBeenCalledWith('/api/finmon-agent', expect.objectContaining({
      body: expect.stringContaining('"userLevel":1')
    }));
  });
});