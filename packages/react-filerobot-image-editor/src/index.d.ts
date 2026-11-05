import {
  FunctionComponent,
  RefObject,
  Dispatch,
  SetStateAction,
  CSSProperties,
} from 'react';

/** Theme overrides accepted by the editor, without a styled-components type dependency. */
export interface ThemeOverride {
  readonly palette?: Readonly<Partial<Record<string, string>>>;
  readonly typography?: {
    readonly fontFamily?: string;
    readonly baseLineHeight?: string | number;
    readonly font?: Readonly<Partial<Record<string, CSSProperties>>>;
  };
  readonly shape?: {
    readonly borderRadius?: Readonly<
      Partial<Record<'sm' | 'md' | 'lg', string>>
    >;
  };
  readonly shadows?: Readonly<Partial<Record<string, string>>>;
  // Accepted for compatibility; editor navigation uses its own screen breakpoints.
  readonly breakpoints?: {
    keys?: string[];
    values?: Record<string, number>;
    classes?: Record<string, string>;
    getBreakpointClass?: (width: number, hideSelector?: boolean) => string;
    up?: (key: string | number) => string;
    down?: (key: string) => string;
    between?: (start: string, end: string) => string;
    only?: (key: string) => string;
  };
}

declare const TABS: {
  readonly FINETUNE: 'Finetune';
  readonly FILTERS: 'Filters';
  readonly ADJUST: 'Adjust';
  readonly WATERMARK: 'Watermark';
  readonly ANNOTATE: 'Annotate';
  readonly RESIZE: 'Resize';
};

declare const TOOLS: {
  readonly CROP: 'Crop';
  readonly ROTATE: 'Rotate';
  readonly FLIP_X: 'Flip_X';
  readonly FLIP_Y: 'Flip_Y';
  readonly BRIGHTNESS: 'Brightness';
  readonly CONTRAST: 'Contrast';
  readonly HSV: 'HueSaturationValue';
  readonly WARMTH: 'Warmth';
  readonly BLUR: 'Blur';
  readonly THRESHOLD: 'Threshold';
  readonly POSTERIZE: 'Posterize';
  readonly PIXELATE: 'Pixelate';
  readonly NOISE: 'Noise';
  readonly FILTERS: 'Filters';
  readonly RECT: 'Rect';
  readonly ELLIPSE: 'Ellipse';
  readonly POLYGON: 'Polygon';
  readonly TEXT: 'Text';
  readonly LINE: 'Line';
  readonly IMAGE: 'Image';
  readonly ARROW: 'Arrow';
  readonly WATERMARK: 'Watermark';
  readonly PEN: 'Pen';
  readonly RESIZE: 'Resize';
};

// TABS_IDS
type availableTabs = (typeof TABS)[keyof typeof TABS];

// TOOLS_IDS
type availableTools = (typeof TOOLS)[keyof typeof TOOLS];

type lineCap = 'butt' | 'round' | 'square';

// CLOSING_REASONS
type closingReasons =
  | 'after-saving'
  | 'close-button-clicked'
  | 'back-button-clicked'
  | string;

type savedImageData = {
  name: string;
  extension: string;
  mimeType: string;
  fullName?: string;
  height?: number;
  width?: number;
  imageBase64?: string;
  imageCanvas?: HTMLCanvasElement; // doesn't support quality
  quality?: number;
  cloudimageUrl?: string;
};

type annotationsCommon = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowBlur?: number;
  shadowColor?: string;
  shadowOpacity?: number;
  opacity?: number;
};

type textAnnotation = annotationsCommon & {
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  letterSpacing?: number;
  lineHeight?: number;
  align?: 'left' | 'center' | 'right';
  fontStyle?: 'normal' | 'bold' | 'italic' | 'bold italic';
};

type imageAnnotation = annotationsCommon & {
  disableUpload?: boolean;
  gallery?: {
    originalUrl: string;
    previewUrl: string;
  }[];
};

type rectAnnotation = annotationsCommon & {
  cornerRadius?: number;
};

type polygonAnnotation = annotationsCommon & {
  sides?: number;
};

type penAnnotation = annotationsCommon & {
  tension?: number;
  lineCap?: lineCap;
  selectAnnotationAfterDrawing?: boolean;
};

type lineAnnotation = annotationsCommon & {
  lineCap?: lineCap;
};

type arrowAnnotation = annotationsCommon & {
  lineCap?: lineCap;
  pointerLength?: number;
  pointerWidth?: number;
};

type rotateAnnotation = {
  angle?: number;
  componentType?: 'slider' | 'buttons';
};

type cropPresetItem = {
  titleKey: string;
  width?: number;
  height?: number;
  ratio?: string | number;
  descriptionKey?: string;
  icon?: string | HTMLElement | FunctionComponent;
  disableManualResize?: boolean;
  noEffect?: boolean;
};

type cropPresetGroup = {
  titleKey: string;
  items: cropPresetItem[];
};

type cropPresetFolder = {
  titleKey: string;
  groups: cropPresetGroup[];
  icon?: string | HTMLElement | FunctionComponent;
};

type imageDesignState = {
  imgSrc?: string;
  finetunes?: string[];
  finetunesProps?: {
    brightness?: number;
    contrast?: number;
    hue?: number;
    saturation?: number;
    value?: number;
    blurRadius?: number;
    warmth?: number;
  };
  filter?: string;
  adjustments?: {
    crop: {
      ratio: string | number;
      width?: number;
      height?: number;
      x?: number;
      y?: number;
      ratioFolderKey?: string;
      ratioGroupKey?: string;
      ratioTitleKey?: string;
    };
    isFlippedX?: boolean;
    isFlippedY?: boolean;
    rotation?: number;
  };
  annotations?: {
    [key: string]: annotationsCommon &
      (
        | textAnnotation
        | rectAnnotation
        | polygonAnnotation
        | penAnnotation
        | lineAnnotation
        | arrowAnnotation
      ) & {
        id: string;
        name: string;
        x: number;
        y: number;
        scaleX?: number;
        scaleY?: number;
        width?: number; //Text/Image/Rect
        height?: number; //Text/Image/Rect
        radius?: number; // Polygon
        radiusX?: number; // Ellipse
        radiusY?: number; // Ellipse
        points?: number[]; // Pen/Line/Arrow
        image?: string | HTMLElement; // Image
      };
  };
  resize?: {
    width?: number;
    height?: number;
    manualChangeDisabled?: boolean;
  };
  shownImageDimensions?: {
    width: number;
    height: number;
    scaledBy: number;
  };
};

type onSaveFunction = (
  savedImageData: savedImageData,
  imageDesignState: imageDesignState,
) => void | Promise<unknown>;

export type getCurrentImgDataFunction = (
  imageFileInfo?: {
    name?: string;
    extension?: string;
    quality?: number;
    size?: { width?: number; height?: number };
  },
  pixelRatio?: boolean | number,
  keepLoadingSpinnerShown?: boolean,
) => {
  imageData: savedImageData;
  designState: imageDesignState;
  hideLoadingSpinner: () => void;
};

type triggerSaveModalFn = (onSave: onSaveFunction) => void;
type triggerSavingFn = (onSave: onSaveFunction) => void;

type saveOption = {
  label: string;
  icon: string | HTMLElement | FunctionComponent;
  onClick: (showSaveModal: triggerSaveModalFn, save: triggerSavingFn) => void;
};

export interface FilerobotImageEditorConfig {
  theme?: ThemeOverride;
  source: string | HTMLImageElement;
  annotationsCommon?: annotationsCommon;
  // [TOOLS_IDS.TEXT]
  Text?:
    | {
        texts?: textAnnotation[];
      }
    | textAnnotation;
  // [TOOLS_IDS.IMAGE]
  Image?: imageAnnotation;
  // [TOOLS_IDS.ELLIPSE]
  Ellipse?: annotationsCommon;
  // [TOOLS_IDS.RECT]
  Rect?: rectAnnotation;
  // [TOOLS_IDS.POLYGON]
  Polygon?: polygonAnnotation;
  // [TOOLS_IDS.PEN]
  Pen?: penAnnotation;
  // [TOOLS_IDS.LINE]: {
  Line?: lineAnnotation;
  // [TOOLS_IDS.ARROW]: {
  Arrow?: arrowAnnotation;
  // [TOOLS_IDS.ROTATE]:
  Rotate?: rotateAnnotation;
  // [TOOLS_IDS.WATERMARK]
  Watermark?: {
    gallery?: string[] | { url: string; previewUrl: string }[] | [];
    onUploadWatermarkImgClick?: (
      loadAndSetWatermarkImg: (
        imgUrl: string,
        revokeObjectUrl: () => void,
      ) => void,
    ) => Promise<{ url: string; revokeObjectUrl?: boolean }> | void;
    textScalingRatio?: number;
    imageScalingRatio?: number;
    hideTextWatermark?: boolean;
    addressBook?: {
      // Added for AddressBook plugin
      visible: boolean;
      open: () => void;
      isSaved: boolean;
      setIsSaved: Dispatch<SetStateAction<boolean>>;
      addressBookWatermark: string;
    };
  };
  // [TOOLS_IDS.CROP]
  Crop?: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: null;
    maxHeight?: null;
    ratio?: 'original' | 'custom' | 'ellipse' | number;
    noPresets?: boolean;
    ratioTitleKey?: string;
    presetsItems?: cropPresetItem[];
    presetsFolders?: cropPresetFolder[];
    autoResize?: boolean;
    lockCropAreaAt?:
      | 'top-left'
      | 'top-center'
      | 'top-right'
      | 'center-left'
      | 'center-center'
      | 'center-right'
      | 'bottom-left'
      | 'bottom-center'
      | 'bottom-right';
  };
  // TABS_IDS
  tabsIds?: availableTabs[] | [];
  defaultTabId?: availableTabs;
  defaultToolId?: availableTools;
  onBeforeSave?: (savedImageData: savedImageData) => void | boolean;
  onSave?: onSaveFunction;
  onClose?: (closeReason: closingReasons, haveNotSavedChanges: boolean) => void;
  closeAfterSave?: boolean;
  defaultSavedImageName?: string;
  defaultSavedImageType?: 'png' | 'jpeg' | 'jpg' | 'webp';
  defaultSavedImageQuality?: number;
  forceToPngInEllipticalCrop?: boolean;
  useBackendTranslations?: boolean;
  translations?: object;
  language?:
    | 'en'
    | 'fr'
    | 'de'
    | 'it'
    | 'pt'
    | 'es'
    | 'nl'
    | 'pl'
    | 'ro'
    | string;
  avoidChangesNotSavedAlertOnLeave?: boolean;
  loadableDesignState?: imageDesignState;
  showBackButton?: boolean;
  savingPixelRatio: number;
  previewPixelRatio: number;
  moreSaveOptions?: saveOption[];
  useCloudimage?: boolean;
  cloudimage?: {
    token: string;
    dontPrefixUrl?: boolean;
    domain?: string;
    version?: string;
    secureProtocol?: boolean;
    loadableQuery?: string;
    imageSealing?: {
      enable?: boolean;
      salt?: string;
      charCount?: number;
      includeParams?: string[];
    };
  };
  observePluginContainerSize?: boolean;
  showCanvasOnly?: boolean;
  getCurrentImgDataFnRef?: RefObject<getCurrentImgDataFunction | null>;
  updateStateFnRef?: RefObject<
    ((newStatePart: {} | ((currentState: {}) => void)) => void) | null
  >;
  onModify?: (currentImageDesignState: imageDesignState) => void;
  useZoomPresetsMenu?: boolean;
  disableZooming?: boolean;
  noCrossOrigin?: boolean;
  disableSaveIfNoChanges?: boolean;
  removeSaveButton?: boolean;
  resetOnImageSourceChange?: boolean;
  restoreConfig?: {
    showRestore: boolean;
    onClick: (...args: any[]) => void;
  };
  controls?: {
    withControls?: boolean;
    onPrev?: () => void;
    onNext?: () => void;
  };
}

declare const FilerobotImageEditor: FunctionComponent<FilerobotImageEditorConfig>;

export default FilerobotImageEditor;
export { TABS, TOOLS };
