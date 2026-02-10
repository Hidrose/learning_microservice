import { memo } from "react";

interface Props {
  children: React.ReactNode;
}

function ListBody({ children }: Props) {
  return <div className="bg-white w-full overflow-auto">{children}</div>;
}

export default memo(ListBody);
