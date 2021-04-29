import React from 'react';
import { Scheduler } from "../scheduler";

type ContextProps = { 
  scheduler: Scheduler | undefined,
  setScheduler: (a: Scheduler) => void,
};

// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!
export const schedulerContext = React.createContext<ContextProps>({
  scheduler: undefined,
  setScheduler: (_) => {},});

