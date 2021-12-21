/* eslint-disable react/prop-types */
import React from "react";
import cx from "classnames";

import { formDomOnlyProps } from "metabase/lib/redux";

const FormTextAreaWidget = ({
  placeholder,
  field,
  className,
  rows,
  autoFocus,
  tabIndex,
}) => (
  <textarea
    autoFocus={autoFocus}
    className={cx(className, "Form-input full")}
    rows={rows}
    placeholder={placeholder}
    aria-labelledby={`${field.name}-label`}
    tabIndex={tabIndex}
    {...formDomOnlyProps(field)}
  />
);

export default FormTextAreaWidget;
