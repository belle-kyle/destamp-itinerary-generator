import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { render } from '@testing-library/react-native';

import IconButton from '../IconButton';

describe('Icon Button', () => {
  it('should render successfully', () => {
    const buttonCallbackFunction = jest.fn(() => null);
    const { getByRole } = render(
      <IconButton
        icon={<AntDesign name="heart" />}
        onPress={buttonCallbackFunction}
      />,
    );
    const iconBtnElement = getByRole('button');

    expect(iconBtnElement).toBeDefined();
  });
});
