// Open on key release: the opening Enter/Space must not activate the first item.
const triggerKeyboard = (open) => ({
  onKeyDown: (event) => {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        open(event, event.key === 'ArrowUp' ? 'last' : 'first');
      }
    }
  },
  onKeyUp: (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      open(event, 'first');
    }
  },
});

export default triggerKeyboard;
