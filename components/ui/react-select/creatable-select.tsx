import * as React from "react";
import CreatableSelect from "react-select/creatable";
import type { Props } from "react-select";
import { defaultClassNames, defaultStyles } from "@/components/ui/react-select/helper";
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
  Option
} from "@/components/ui/react-select/components";

const Creatable = React.forwardRef<
  React.ElementRef<typeof CreatableSelect>,
  React.ComponentPropsWithoutRef<typeof CreatableSelect>
>((props: Props, ref) => {
  const {
    value,
    onChange,
    options = [],
    styles = defaultStyles,
    classNames = defaultClassNames,
    components = {},
    ...rest
  } = props;

  const id = React.useId();

  return (
    <CreatableSelect
      instanceId={id}
      ref={ref}
      value={value}
      onChange={onChange}
      options={options}
      unstyled
      components={{
        DropdownIndicator,
        ClearIndicator,
        MultiValueRemove,
        Option,
        ...components
      }}
      styles={styles}
      classNames={classNames}
      {...rest}
    />
  );
});
Creatable.displayName = "Creatable";
export default Creatable;
