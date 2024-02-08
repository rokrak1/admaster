import api from ".";

export const createTemplate = async (
  name: string,
  template: any
): Promise<[any | null, unknown]> => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_API_URL}/templates`,
      {
        name,
        template: template || [],
      },
      { withCredentials: true }
    );
    return [{ ...response.data.template[0] }, null];
  } catch (error) {
    return [null, error];
  }
};
export const updateTemplate = async (
  sequanceId: string,
  name: string,
  template: any
): Promise<[any | null, unknown]> => {
  try {
    const response = await api.put(
      `${import.meta.env.VITE_API_URL}/templates/${sequanceId}`,
      {
        name,
        template: template || [],
      },
      { withCredentials: true }
    );
    return [{ ...response.data.template[0] }, null];
  } catch (error) {
    return [null, error];
  }
};
export const deleteTemplate = async (
  sequanceId: string
): Promise<[any | null, unknown]> => {
  try {
    const response = await api.delete(
      `${import.meta.env.VITE_API_URL}/templates/${sequanceId}`,
      { withCredentials: true }
    );
    return [{ ...response.data.template[0] }, null];
  } catch (error) {
    return [null, error];
  }
};

export const fetchTemplates = async (): Promise<[any | null, unknown]> => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/templates`,
      { withCredentials: true }
    );
    return [response.data.templates, null];
  } catch (error) {
    return [null, error];
  }
};
