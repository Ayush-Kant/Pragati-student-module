const EmptyState = ({
    title = "No Placement Drives Found",
    message = "Create your first placement drive to get started.",
  }) => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 text-5xl">📂</div>
  
        <h2 className="text-xl font-semibold text-gray-800">
          {title}
        </h2>
  
        <p className="mt-2 text-gray-500">
          {message}
        </p>
      </div>
    );
  };
  
  export default EmptyState;