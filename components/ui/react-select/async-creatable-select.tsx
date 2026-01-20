// This example uses the combined async + creatable variant, imported from react-select/async-creatable
import * as React from "react";
import AsyncCreatableSelectComponent from "react-select/async-creatable";
import type { Props } from "react-select";
import { defaultClassNames, defaultStyles } from "@/components/ui/react-select/helper";
import {
  ClearIndicator,
  DropdownIndicator,
  MultiValueRemove,
  Option
} from "@/components/ui/react-select/components";

const AsyncCreatableSelect = React.forwardRef<
  React.ElementRef<typeof AsyncCreatableSelectComponent>,
  React.ComponentPropsWithoutRef<typeof AsyncCreatableSelectComponent>
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
    <AsyncCreatableSelectComponent
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

AsyncCreatableSelect.displayName = "Async Creatable Select";
export default AsyncCreatableSelect;
