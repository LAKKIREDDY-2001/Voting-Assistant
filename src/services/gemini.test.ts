import { describe, it, expect, vi, beforeEach } from 'vitest';
import { askElectionAssistant } from './gemini';

global.fetch = vi.fn();

describe('askElectionAssistant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the chat API with correct parameters', async () => {
    const mockResponse = { text: 'Election details here' };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await askElectionAssistant('When is the election?', []);
    
    expect(fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ query: 'When is the election?', history: [] }),
    }));
    expect(result).toBe('Election details here');
  });

  it('returns a fallback message on API error', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await askElectionAssistant('Help', []);
    expect(result).toContain('visit eci.gov.in');
  });
});
