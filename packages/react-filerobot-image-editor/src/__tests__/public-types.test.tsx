import { createRef, useRef } from 'react';
import Editor, {
  TABS,
  TOOLS,
  type FilerobotImageEditorConfig,
  type getCurrentImgDataFunction,
  type ThemeOverride,
} from '@wedat2024/react-filerobot-image-editor';

const theme: ThemeOverride = {
  palette: { 'accent-primary': '#b33d35' },
  typography: { font: { 'label-medium': { letterSpacing: '3px' } } },
};

const config: FilerobotImageEditorConfig = {
  source: 'fixture.png',
  savingPixelRatio: 1,
  previewPixelRatio: 1,
  defaultTabId: TABS.ANNOTATE,
  defaultToolId: TOOLS.TEXT,
  theme,
  getCurrentImgDataFnRef: createRef<getCurrentImgDataFunction>(),
  onSave: async (image) => {
    void image.mimeType;
  },
};

function Consumer() {
  const imageRef = useRef<getCurrentImgDataFunction | null>(null);
  const imageData = imageRef.current?.().imageData;
  imageRef.current?.({ extension: 'png' }, 2);
  void imageData;

  const updateRef = useRef<((state: {}) => void) | null>(null);

  return (
    <Editor
      {...config}
      getCurrentImgDataFnRef={imageRef}
      updateStateFnRef={updateRef}
    />
  );
}

// @ts-expect-error Ref must expose an image getter, not an HTML element.
const invalidRef: FilerobotImageEditorConfig['getCurrentImgDataFnRef'] =
  createRef<HTMLDivElement>();

// @ts-expect-error Theme colors must remain strings.
const invalidTheme: ThemeOverride = { palette: { 'accent-primary': 42 } };

void [Consumer, invalidRef, invalidTheme];
