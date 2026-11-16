import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import ErrorIcon from '@scaleflex/icons/error';
import Warning from '@scaleflex/icons/warning';
import Success from '@scaleflex/icons/success';

import { SET_FEEDBACK } from 'actions';
import { useStore } from 'hooks';
import { FEEDBACK_STATUSES } from 'utils/constants';
import Notification from 'ui/Notification';

const defaultAnchorOrigin = { horizontal: 'center', vertical: 'bottom' };
const statuses = {
  [FEEDBACK_STATUSES.ERROR]: {
    Icon: ErrorIcon,
    color: 'rgb(246, 61, 61)',
    background: 'bg-red',
  },
  [FEEDBACK_STATUSES.WARNING]: {
    Icon: Warning,
    color: 'rgb(255, 172, 74)',
    background: 'bg-orange',
  },
};
const success = {
  Icon: Success,
  color: 'rgb(38, 193, 122)',
  background: 'bg-green',
};

// Mount only while feedback exists, just like the previous Popup.
const FeedbackNotice = ({
  feedback,
  dispatch,
  t,
  palette,
  typography,
  anchorOrigin,
}) => {
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [delay, setDelay] = useState(feedback.duration ?? 5000);
  const [portal] = useState(() => document.createElement('div'));
  const { Icon, color, background } =
    statuses[feedback.status || FEEDBACK_STATUSES.ERROR] || success;
  const font = typography.font['text-small-up'];

  const onClose = () =>
    dispatch({ type: SET_FEEDBACK, payload: { feedback: {} } });

  useEffect(() => {
    portal.className = 'FIE_feedback-portal';
    document.body.appendChild(portal);

    return () => portal.remove();
  }, [portal]);

  useEffect(() => {
    if (!hovering && !focused && delay) {
      const timer = setTimeout(onClose, delay);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [hovering, focused, delay, onClose]);

  return createPortal(
    <Notification
      className="FIE_feedback-robot"
      data-horizontal={anchorOrigin.horizontal || 'left'}
      data-vertical={anchorOrigin.vertical || 'bottom'}
      message={feedback.message}
      labelStyle={font}
      icon={<Icon size={20} color={color} />}
      closeLabel={t('close')}
      onClose={onClose}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setDelay(1000);
      }}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
          setDelay(1000);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          onClose();
        }
      }}
      style={{
        '--fie-notice-shadow': palette['large-shadow'],
        '--fie-notice-status-background': palette[background],
        '--fie-notice-background': palette['btn-primary-text'],
        '--fie-notice-color': palette['txt-primary'],
        '--fie-notice-font-family': font.fontFamily,
        '--fie-notice-font-size': font.fontSize,
        '--fie-notice-font-weight': font.fontWeight,
        '--fie-notice-line-height': font.lineHeight,
        '--fie-notice-close-background': palette['bg-stateless'],
        '--fie-notice-close-color': palette['icons-secondary'],
        '--fie-notice-close-hover-color': palette['icon-primary'],
        '--fie-notice-close-active-color': palette['icons-primary-hover'],
        '--fie-notice-hover': palette['bg-hover'],
        '--fie-notice-active': palette['bg-active'],
        '--fie-notice-focus': palette['accent-stateless'],
      }}
    />,
    portal,
  );
};

const FeedbackPopup = ({ anchorOrigin }) => {
  const {
    feedback = {},
    dispatch,
    t,
    theme: { palette, typography },
  } = useStore();

  if (!feedback.message) return null;

  return (
    <FeedbackNotice
      feedback={feedback}
      dispatch={dispatch}
      t={t}
      palette={palette}
      typography={typography}
      anchorOrigin={anchorOrigin}
    />
  );
};

FeedbackPopup.defaultProps = { anchorOrigin: defaultAnchorOrigin };
FeedbackPopup.propTypes = { anchorOrigin: PropTypes.instanceOf(Object) };
FeedbackNotice.propTypes = {
  feedback: PropTypes.instanceOf(Object).isRequired,
  dispatch: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  palette: PropTypes.instanceOf(Object).isRequired,
  typography: PropTypes.instanceOf(Object).isRequired,
  anchorOrigin: PropTypes.instanceOf(Object).isRequired,
};

export default FeedbackPopup;
