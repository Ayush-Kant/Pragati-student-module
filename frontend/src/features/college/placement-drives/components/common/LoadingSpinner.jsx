const LoadingSpinner = ({
    size = "md",
    text = "Loading...",
  }) => {
    const spinnerSize = {
      sm: "h-5 w-5",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    };
  
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div
          className={`
            animate-spin
            rounded-full
            border-4
            border-[#ff7a00]
            border-t-transparent
            ${spinnerSize[size]}
          `}
        />
  
        <p className="mt-4 text-sm text-gray-500">
          {text}
        </p>
      </div>
    );
  };
  
  export default LoadingSpinner;