import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from '@/components/Chat';

// Mock fetch
global.fetch = jest.fn();

describe('Chat Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders chat interface', () => {
    render(<Chat />);
    
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });

  it('handles text input', () => {
    render(<Chat />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    expect(input).toHaveValue('Hello');
  });

  it('handles message submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: 'Hello! How can I help you?',
        usage: { total_tokens: 10 }
      })
    });

    render(<Chat />);
    
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Thinking...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument();
    });

    expect(input).toHaveValue('');
  });

  it('handles API errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'API Error'
      })
    });

    render(<Chat />);
    
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('validates file upload', () => {
    render(<Chat />);
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload Image');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText('Please upload a valid image file (JPEG, PNG, GIF, or WebP)')).toBeInTheDocument();
  });

  it('enforces rate limiting', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'Rate limit exceeded. Please try again in 60 seconds'
      })
    });

    render(<Chat />);
    
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Rate limit exceeded. Please try again in 60 seconds')).toBeInTheDocument();
    });
  });
}); 