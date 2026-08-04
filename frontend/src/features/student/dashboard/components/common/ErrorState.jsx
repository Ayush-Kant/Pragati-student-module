import React from "react";
import PropTypes from "prop-types";

export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center my-4">
      <p className="text-sm font-semibold text-red-700">⚠ {message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="mt-3 px-4 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition cursor-pointer"
        >
          Retry Loading
        </button>
      )}
    </div>
  );
}

ErrorState.propTypes = { message: PropTypes.string, onRetry: PropTypes.func };