/* global jest */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/display-name */
// @ts-nocheck
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  // @expo/vector-icons v15 renders a null glyph in jest (icon fonts are not
  // loaded) — mock every icon set as a plain Text for stable snapshots.
  const Icon = (props) => <Text {...props} />;

  return {
    AntDesign: Icon,
    Entypo: Icon,
    EvilIcons: Icon,
    Feather: Icon,
    FontAwesome: Icon,
    FontAwesome5: Icon,
    Foundation: Icon,
    Ionicons: Icon,
    MaterialCommunityIcons: Icon,
    MaterialIcons: Icon,
    Octicons: Icon,
    SimpleLineIcons: Icon,
    Zocial: Icon,
    createIconSet: () => Icon,
  };
});
