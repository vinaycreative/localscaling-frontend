import React from "react";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return <p className="text-xs text-red-500 text-end">{message}</p>;
};

export default ErrorMessage;
