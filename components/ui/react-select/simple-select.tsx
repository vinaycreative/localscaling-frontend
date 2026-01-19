import * as React from "react";
import SelectComponent from "react-select";
import type { Props } from "react-select";
import { defaultClassNames, defaultStyles } from "@/components/ui/react-select/helper";
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
  Option,
} from "@/components/ui/react-select/components";

const SimpleSelect = React.forwardRef<
  React.ElementRef<typeof SelectComponent>,
  React.ComponentPropsWithoutRef<typeof SelectComponent>
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
    <SelectComponent
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
        ...components,
      }}
      styles={styles}
      classNames={classNames}
      {...rest}
    />
  );
});
SimpleSelect.displayName = "SimpleSelect";
export default SimpleSelect;