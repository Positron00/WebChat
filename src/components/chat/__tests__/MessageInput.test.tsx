import { render, screen, fireEvent } from '@testing-library/react';
import { MessageInput } from '../MessageInput';

describe('MessageInput Component', () => {
  const mockProps = {
    value: '',
    onChange: jest.fn(),
    onSubmit: jest.fn(),
    onFileSelect: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input field and buttons', () => {
    render(<MessageInput {...mockProps} />);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByLabelText('Send Message')).toBeInTheDocument();
    expect(screen.getByText('Attach')).toBeInTheDocument();
  });

  it('handles text input', () => {
    render(<MessageInput {...mockProps} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    expect(mockProps.onChange).toHaveBeenCalledWith('Hello');
  });

  it('handles submit on Enter', () => {
    render(<MessageInput {...mockProps} value="Hello" />);
    
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockProps.onSubmit).toHaveBeenCalled();
  });

  it('disables input when loading', () => {
    render(<MessageInput {...mockProps} isLoading={true} />);
    
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('handles file selection', () => {
    render(<MessageInput {...mockProps} />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Upload Image');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(mockProps.onFileSelect).toHaveBeenCalledWith(file);
  });
}); 