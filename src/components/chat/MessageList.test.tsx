/** @vitest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MessageList } from './MessageList';

describe('MessageList', () => {
  it('renders messages correctly', () => {
    const messages = [
      { role: 'user' as const, text: 'Hello' },
      { role: 'model' as const, text: 'Hi there' },
    ];
    render(<MessageList messages={messages} isLoading={false} />);
    
    expect(screen.getByText('Hello')).toBeTruthy();
    expect(screen.getByText('Hi there')).toBeTruthy();
  });

  it('shows loading indicator when isLoading is true', () => {
    render(<MessageList messages={[]} isLoading={true} />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
});
