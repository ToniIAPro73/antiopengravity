export const getTimeDefinition = {
  type: "function" as const,
  function: {
    name: "get_current_time",
    description: "Get the current local time in ISO format to answer questions about time or dates.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

export const executeGetTime = async (_args: string): Promise<string> => {
  return new Date().toISOString();
};
