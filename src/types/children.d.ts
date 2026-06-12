import React from 'react';

export type PropsWithChildren<T = unknown> = Readonly<
  {
    children?: React.ReactNode;
  } & T
>;
