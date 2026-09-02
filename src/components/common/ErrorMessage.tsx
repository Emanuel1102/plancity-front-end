interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div data-testid="message" className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}