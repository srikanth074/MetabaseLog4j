import styled, { css } from "styled-components";

import { space } from "metabase/styled-components/theme";
import { color } from "metabase/lib/colors";

export const EditorContainer = styled.div`
  border: 1px solid;
  border-color: ${color("border")};
  border-radius: ${space(0)};
  display: flex;
  position: relative;
  margin: ${space(1)} 0;
  padding: ${space(1)};
  transition: border 0.3s linear;

  ${({ isFocused }) =>
    isFocused &&
    css`
      border-color: ${color("brand")};
    `}

  ${({ hasError }) =>
    hasError &&
    css`
      border-color: ${color("error")};
    `}

  @media (prefers-reduced-motion) {
    transition: none;
  }
`;

export const EditorEqualsSign = styled.div`
  font: 12px / normal "Monaco", "Menlo", "Ubuntu Mono", "Consolas",
    "source-code-pro", monospace;
  height: 12px;
  font-weight: 700;
  margin: 0 ${space(0)}};
`;