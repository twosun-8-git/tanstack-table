import { useEffect, useRef } from "react";

type Props = {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Checkbox({ indeterminate, ...rest }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);

  return (
    <div className="checkbox" onClick={(e) => e.stopPropagation()}>
      <input type="checkbox" ref={ref} {...rest} />
    </div>
  );
}
