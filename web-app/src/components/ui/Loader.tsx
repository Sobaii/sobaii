import { LoaderSvg } from "../../assets/animations";

function Loader() {
  return (
    <div className="flex h-full m-auto justify-center flex-col items-center">
      <h1 className="w-fit">Loading...</h1>
      <img src={LoaderSvg} />
    </div>
  );
}

export default Loader;
