import { parse } from "metabase/lib/expressions/recursive-parser";
import { resolve } from "metabase/lib/expressions/resolver";

import {
  parseDimension,
  parseMetric,
  parseSegment,
} from "metabase/lib/expressions/";

export function processSource(options) {
  const resolveMBQLField = (kind, name) => {
    if (kind === "metric") {
      const metric = parseMetric(name, options);
      if (!metric) {
        throw new Error(`Unknown Metric: ${name}`);
      }
      return ["metric", metric.id];
    } else if (kind === "segment") {
      const segment = parseSegment(name, options);
      if (!segment) {
        throw new Error(`Unknown Segment: ${name}`);
      }
      return ["segment", segment.id];
    } else {
      // fallback
      const dimension = parseDimension(name, options);
      if (!dimension) {
        throw new Error(`Unknown Field: ${name}`);
      }
      return dimension.mbql();
    }
  };

  const { source, startRule } = options;

  let expression;
  let compileError;
  try {
    expression = resolve(parse(source), startRule, resolveMBQLField);
  } catch (e) {
    console.warn("compile error", e);
    compileError = e;
  }

  return {
    source,
    expression,
    compileError,
  };
}
