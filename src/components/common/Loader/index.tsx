import "./index.css";
const Loader = () => {
  // return (
  //   <div className="flex h-screen items-center justify-center bg-white/15 dark:bg-black">
  //     <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
  //   </div>
  // );

  return (
    <div className="dots-container__wrapper">
      <div className="dots-container">
        <div className="dots bg-prussianBlue dark:bg-blue-600"></div>
        <div className="dots bg-prussianBlue dark:bg-blue-600"></div>
        <div className="dots bg-prussianBlue dark:bg-blue-600"></div>
        <div className="dots bg-prussianBlue dark:bg-blue-600"></div>
        <div className="dots bg-prussianBlue dark:bg-blue-600"></div>
      </div>
    </div>
  );
};

export default Loader;
