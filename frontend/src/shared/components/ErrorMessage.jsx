import React from 'react';

export default function ErrorMessage({ message }) {
  return <div>{message || 'An error occurred'}</div>;
}
