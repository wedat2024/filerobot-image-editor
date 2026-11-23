# @wedat2024/react-filerobot-image-editor

React component version of the Filerobot image editor for React 19. There are no runtime version branches or additional React copies.

## Requirements

The React 19 peer ranges accept React/React DOM `^19.3.1` and react-konva `^19.3.2`. The matrix below records the tested combinations; it does not imply that every later minor version has been tested.

| React / React DOM | react-konva | react-reconciler |
| --- | --- | --- |
| 19.3.1 | 19.3.2 | 0.34.0 |

React, React DOM and react-konva are peer dependencies supplied by the application. The application must supply React/React DOM 19 and react-konva 19 within the declared peer ranges. Konva 8.4.3 is an editor dependency. The package does not bundle another React runtime. The standalone JS/UMD distribution includes React 19.3.1 and react-konva 19.3.2.

## Local installation

Build and pack locally, then install the tarball with your existing @wedat2024 registry configuration. Version 7.0.0 requires React 19 and widens its peer ranges to permit compatible minor updates. A local version change does not publish the package.

For a React 19 application:

~~~sh
npm install react@19.3.1 react-dom@19.3.1 react-konva@19.3.2
npm install ./wedat2024-react-filerobot-image-editor-7.0.0.tgz
~~~

CSS is injected automatically; no separate CSS import, styled-components, Scaleflex UI or Tailwind is required. Use the automatic JSX transform and types matching the host React version.

## Type integration

Use the exported getCurrentImgDataFunction type for image getter refs and initialize useRef with null. The imageFileInfo argument is optional, matching the runtime default. Derive saved image data from ReturnType<getCurrentImgDataFunction>['imageData']; quality is optional. Do not duplicate a stricter callback result type in consumers.

The public type fixture is src/__tests__/public-types.test.tsx. It checks the public API against the host React types.

See the [main README](../../README.md) for editor configuration. Upstream CDN links refer to upstream releases. Standalone npm packaging of the unscoped JS bridge remains a separate existing limitation.
