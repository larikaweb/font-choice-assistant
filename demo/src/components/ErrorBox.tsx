interface ErrorBoxProps {
  message: string | null;
}

export function ErrorBox({ message }: ErrorBoxProps) {
  if (!message) return null;
  return <div className="error-box">{message}</div>;
}
