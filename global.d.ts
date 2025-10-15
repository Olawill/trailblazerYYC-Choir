// CSS Module declarations
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.sass" {
  const content: Record<string, string>;
  export default content;
}

// Allow side-effect CSS imports (like import './globals.css')
declare module "*.css?*" {
  const content: Record<string, string>;
  export default content;
}
