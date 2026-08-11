// Local types for react-native-wheel-scrollview-picker (the package's `types`
// field points at its TS source; typed locally instead).

import type { ComponentType } from 'react';

interface ScrollPickerProps {
  dataSource: (string | number)[];
  selectedIndex: number;
  wrapperHeight?: number;
  itemHeight?: number;
  highlightColor?: string;
  onValueChange?: (data: number, selectedIndex: number) => void;
  [key: string]: unknown;
}

const ScrollPicker: ComponentType<ScrollPickerProps>;
export default ScrollPicker;
