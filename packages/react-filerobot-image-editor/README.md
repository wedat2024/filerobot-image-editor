# @wedat2024/react-filerobot-image-editor

React component version of the Filerobot image editor. One implementation supports React 18 and React 19 through the shared forwardRef API. There are no runtime version branches or additional React copies.

## Requirements

| React / React DOM | react-konva | react-reconciler |
| --- | --- | --- |
| 18.2.0 | 18.2.7 | 0.29.0, pinned by the consumer |
| 18.3.1 | 18.2.7–18.2.10 | 0.29.2 |
| 19.3.1 | 19.3.2 | 0.34.0 |

React, React DOM and react-konva are peer dependencies supplied by the application. Match their major versions as shown above; peer ranges cannot express this pairing. Konva 8.4.3 is an editor dependency. The package does not bundle another React runtime. The standalone JS/UMD distribution includes React 19.3.1 and react-konva 19.3.2.

## Local installation

The branch is unpublished. Build and pack locally, then install the tarball with your existing @wedat2024 registry configuration. Its development version remains 5.3.3; use the bundle hash to identify the tested revision.

For a React 19 application:

~~~sh
npm install react@19.3.1 react-dom@19.3.1 react-konva@19.3.2
npm install ./wedat2024-react-filerobot-image-editor-5.3.3.tgz
~~~

For React 18.3, retain React/DOM 18.3.1 and react-konva 18.2.x. React 18.2 consumers must pin react-reconciler 0.29.0 because newer 0.29.2 requires React 18.3. Run npm ls after installation. Do not install React 19 alongside a React 18 host to satisfy peer warnings.

CSS is injected automatically; no separate CSS import, styled-components, Scaleflex UI or Tailwind is required. Use the automatic JSX transform and types matching the host React version.

## Type integration

Use the exported getCurrentImgDataFunction type for image getter refs and initialize useRef with null. The imageFileInfo argument is optional, matching the runtime default. Derive saved image data from ReturnType<getCurrentImgDataFunction>['imageData']; quality is optional. Do not duplicate a stricter callback result type in consumers.

The public type fixture is src/__tests__/public-types.test.tsx. Earlier React 19-only results belong to an experimental revision and do not describe this implementation.

See the [main README](../../README.md) for editor configuration. Upstream CDN links refer to upstream releases. Standalone npm packaging of the unscoped JS bridge remains a separate existing limitation.
