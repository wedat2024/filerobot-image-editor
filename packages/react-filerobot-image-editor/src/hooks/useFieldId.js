import { useState } from 'react';

import randomId from 'utils/randomId';

// Stable IDs without raising the React >=17 peer requirement.
const useFieldId = () => {
  const [id] = useState(() => randomId('fie-field'));

  return id;
};

export default useFieldId;
