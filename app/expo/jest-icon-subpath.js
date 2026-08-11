/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable react/display-name */
// Subpath mock for @expo/vector-icons/* imports (see jest-setup.js).
const React = require('react');
const { Text } = require('react-native');

module.exports = (props) => <Text {...props} />;
