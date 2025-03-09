import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function AppPage({ title, children }: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full bg-white border-b flex flex-col items-center">
        <div className="font-black max-w-7xl p-10  w-full">
          <h1>{title}</h1>
        </div>
      </div>
      <div className="p-10 w-full max-w-7xl">{children}</div>
    </div>
  );
}
