

const Loader = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <div className="absolute inset-2 rounded-full bg-background" />
        </div>

        <p className="text-sm font-medium text-muted-foreground">
          Loading ...
        </p>
      </div>
    </div>
    );
};

export default Loader;