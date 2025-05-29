import '../../assets/css/spinner.css';

export default function Loading() {
  return (
    <>
      <div className="container mx-auto flex h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}
