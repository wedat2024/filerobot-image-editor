import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Arrow from '@scaleflex/icons/arrow';

import { useStore } from 'hooks';
import useFieldId from 'hooks/useFieldId';
import ThemeScope from 'context/CssTheme';
import AnchoredMenu from 'components/common/AnchoredMenu';
import PopupTrigger from 'ui/PopupTrigger';

import CropPresetGroup from './CropPresetGroup';
import styles from './CropFolder.module.css';
import CropStyles from './Crop.module.css';

const FOCUSABLE = 'button:not(:disabled)';

const CropPresetGroupsFolder = ({
  titleKey,
  Icon,
  groups,
  onItemSelect,
  t,
}) => {
  const {
    theme: { palette, typography },
    adjustments: {
      crop: { ratioFolderKey, ratioGroupKey },
    },
  } = useStore();
  const [expandedGroup, setExpandedGroup] = useState('');
  const [open, setOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const id = useFieldId();

  const itemStyle = {
    ...typography.font['label-medium'],
    '--fie-menu-background': palette['bg-secondary'],
    '--fie-menu-color': palette['txt-primary'],
    '--fie-menu-active': palette['bg-active'],
    '--fie-menu-hover': palette['bg-hover'],
    '--fie-menu-focus': palette['accent-stateless'],
  };

  useEffect(() => {
    if (open && keyboardOpen) {
      panelRef.current
        ?.querySelector(FOCUSABLE)
        ?.focus({ preventScroll: true });
    }
  }, [open, keyboardOpen]);

  const show = (keyboard = false) => {
    if (!groups.length) return;

    setKeyboardOpen(keyboard);
    setOpen(true);
  };

  const close = (restoreFocus = false) => {
    if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
    setOpen(false);
    setKeyboardOpen(false);
  };

  const onItemSelectFromFolder = (event, ratio, props) => {
    onItemSelect(event, ratio, { ...props, ratioFolderKey: titleKey });
  };

  const onPanelKeyDown = (event) => {
    if (!event.currentTarget.contains(event.target)) return;

    if (event.key === 'Escape' || event.key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    } else if (event.key === 'Tab') {
      // The parent panel must not handle a key from this nested portal.
      event.stopPropagation();
      const fields = Array.from(panelRef.current.querySelectorAll(FOCUSABLE));
      const boundary = event.shiftKey ? fields[0] : fields[fields.length - 1];

      if (event.target === boundary) {
        if (event.shiftKey) event.preventDefault();
        close(true);
      }
    }
  };

  return (
    <div
      className="SfxMenuItem-wrapper"
      onMouseLeave={() => {
        if (!keyboardOpen)
          close(panelRef.current?.contains(document.activeElement));
      }}
    >
      <PopupTrigger
        ref={triggerRef}
        role="button"
        tabIndex={0}
        data-active={titleKey === ratioFolderKey || undefined}
        className={`${styles.folder} SfxMenuItem-root`}
        style={itemStyle}
        id={`${id}-trigger`}
        aria-haspopup={groups.length ? 'dialog' : undefined}
        aria-expanded={groups.length ? open : undefined}
        aria-controls={open ? id : undefined}
        onMouseEnter={() => show()}
        onClick={(event) => {
          event.stopPropagation();
          show(event.detail === 0);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            event.stopPropagation();
            show(true);
          }
        }}
      >
        {Icon && (
          <span
            className={`${styles.prefix} SfxMenuItem-prefix`}
            aria-hidden="true"
          >
            <span className={CropStyles.menuItemIcon}>
              {typeof Icon === 'string' ? (
                // eslint-disable-next-line react/no-danger
                <span dangerouslySetInnerHTML={{ __html: Icon }} />
              ) : (
                <Icon color="var(--fie-icon-primary)" />
              )}
            </span>
          </span>
        )}
        <span className={`${styles.content} SfxMenuItem-content`}>
          {t(titleKey)}
        </span>
        <span
          className={`${styles.suffix} SfxMenuItem-suffix`}
          aria-hidden="true"
        >
          <Arrow size={10} color="#768A9F" />
        </span>
      </PopupTrigger>
      {open && (
        <ThemeScope
          as={AnchoredMenu}
          anchor={triggerRef.current}
          position="right"
          overlay={false}
          surfaceRef={panelRef}
          onClose={() => close(true)}
          id={id}
          aria-labelledby={`${id}-trigger`}
          role="dialog"
          className="FIE_crop-folder-menu"
          style={{ backgroundColor: 'var(--fie-bg-stateless)' }}
          onKeyDown={onPanelKeyDown}
        >
          {groups.map(({ titleKey: groupTitleKey, items }) => (
            <div className="SfxMenuItem-wrapper" key={groupTitleKey}>
              <div
                className={`${styles.group} SfxMenuItem-root`}
                style={itemStyle}
              >
                <div className={`${styles.content} SfxMenuItem-content`}>
                  <CropPresetGroup
                    groupTitleKey={groupTitleKey}
                    setExpandedGroup={setExpandedGroup}
                    isExpanded={
                      expandedGroup === ''
                        ? ratioGroupKey === groupTitleKey
                        : expandedGroup === groupTitleKey
                    }
                    t={t}
                    items={items}
                    onItemSelect={onItemSelectFromFolder}
                  />
                </div>
              </div>
            </div>
          ))}
        </ThemeScope>
      )}
    </div>
  );
};

CropPresetGroupsFolder.propTypes = {
  titleKey: PropTypes.string.isRequired,
  groups: PropTypes.instanceOf(Array).isRequired,
  onItemSelect: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  Icon: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.string,
    PropTypes.instanceOf(HTMLElement),
  ]),
};

export default CropPresetGroupsFolder;
