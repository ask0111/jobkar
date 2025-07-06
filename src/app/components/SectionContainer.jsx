const SectionContainer = ({ className, children, ...others }) => {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 lg:px-8 ${className}`} {...others}>
      {children}
    </div>
  );
};


export default SectionContainer;