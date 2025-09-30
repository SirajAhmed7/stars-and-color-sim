// Add data types to window.navigator ambiently for implicit use in the entire project. See https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types- for more info.
/// <reference types="user-agent-data-types" />

declare module "*.glsl" {
  const content: string;
  export default content;
}

declare module "*.vert" {
  const content: string;
  export default content;
}

declare module "*.frag" {
  const content: string;
  export default content;
}

declare module "css-doodle" {
  const cssdoodle: any;
  export default cssdoodle;
}

declare namespace JSX {
  interface IntrinsicElements {
    "css-doodle": any;
  }
}

declare module "glslify";
