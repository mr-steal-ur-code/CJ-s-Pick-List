
export const cleanReferences = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }

  if (
    typeof data === 'number' ||
    typeof data === 'string' ||
    typeof data === 'boolean' ||
    data instanceof Date ||
    (data && typeof data.toDate === 'function') ||
    (data && typeof data.path === 'string')
  ) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => cleanReferences(item));
  }

  if (typeof data === 'object') {
    const cleanedData: Record<string, any> = {};

    for (const key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) {
        continue;
      }

      if (typeof data[key] === 'function' || data[key] === undefined) {
        continue;
      }

      cleanedData[key] = cleanReferences(data[key]);
    }

    return cleanedData;
  }

  return String(data);
};