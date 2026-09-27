/// <reference types="react-scripts" />

// Tells the TypeScript compiler that raw .css asset side-effect modules are perfectly valid imports
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}