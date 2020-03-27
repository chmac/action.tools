import React from "react";
import { Color } from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";
import { LocalDate, Period } from "@js-joda/core";
import { AFTER, BY } from "do.md/dist/constants";

const formatPeriod = (until: Period) => {
  const days = until.days();
  const months = until.toTotalMonths();

  if (until.isZero()) {
    return "TODAY";
  }

  if (until.isNegative()) {
    if (months < 0) {
      return `OVERDUE ${months} month${months !== -1 ? "s" : ""} ${days} day${
        days !== -1 ? "s" : "s"
      }`;
    }
    return `OVERDUE ${days} day${days !== -1 ? "s" : "s"}`;
  }

  if (months > 0) {
    return `${months} month${months !== 1 ? "s" : ""} ${days} day${
      days !== 1 ? "s" : "s"
    }`;
  }

  return `${days} day${days !== 1 ? "s" : "s"}`;
};

const periodToColour = (period: Period, colour: Color) => {
  const months = period.months();
  // Anything months in the future is a light light light colour
  if (months > 0) {
    return colour[50];
  }
  // Anything more than 1 month in the past is the strongest colour
  if (months < 0) {
    return colour[900];
  }

  const days = period.days();

  // If due today, then 600 is an "urgent" but not yet "panic" colour
  if (days === 0) {
    return colour[600];
  }

  // Yesterday is one stronger than today
  if (days === -1) {
    return colour[700];
  }

  // Two days ago is one stronger again
  if (days === -2) {
    return colour[800];
  }

  // Anything over 2 days ago is full "panic" colour
  if (days < 0) {
    return colour[900];
  }

  // Tomorrow is a little lighter than today
  if (days === 1) {
    return colour[500];
  }

  // Two days from now lighter again
  if (days === 2) {
    return colour[400];
  }

  // More than 2 days from now one stop lighter
  // if (days > 2) {
  return colour[300];
  // }
};

// NOTE: Using `today.until()` throws, unclear why
const CodeFactory = (today: LocalDate) => (props: any) => {
  const content = props.children[0];
  const [key, value] = content.split(":");

  if (key === AFTER) {
    const after = LocalDate.parse(value);
    const until = LocalDate.now().until(after);
    return (
      <span style={{ fontWeight: "bold", color: periodToColour(until, blue) }}>
        AFTER {formatPeriod(until)} ({value})
      </span>
    );
  }

  if (key === BY) {
    const by = LocalDate.parse(value);
    const until = LocalDate.now().until(by);
    return (
      <span style={{ fontWeight: "bold", color: periodToColour(until, red) }}>
        BY {formatPeriod(until)} ({value})
      </span>
    );
  }

  return <code {...props} />;
};

export default CodeFactory;
