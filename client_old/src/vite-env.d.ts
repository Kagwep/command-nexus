/// <reference types="vite/client" />

/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
    import React = require('react');
    const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
  }