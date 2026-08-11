// Legacy-lib type shims.
//
// react-model and react-native-wheel-scrollview-picker resolve their `types`
// field to TS *source* files, which tsc then compiles (skipLibCheck does not
// cover .ts sources). Both are redirected via tsconfig `paths` to local .d.ts
// files (see src/types/react-model.d.ts and wheel-scrollview-picker.d.ts).

export {};
