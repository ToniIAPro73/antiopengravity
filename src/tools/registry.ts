import { getTimeDefinition, executeGetTime } from './getTime.js';

export const getToolsDetails = () => {
  return [getTimeDefinition];
};

export const executeTool = async (name: string, args: string): Promise<string> => {
  try {
    switch (name) {
      case 'get_current_time':
        return await executeGetTime(args);
      default:
        return JSON.stringify({ error: `Tool ${name} not found.` });
    }
  } catch (err: any) {
    return JSON.stringify({ error: `Failed to execute tool ${name}: ${err.message}` });
  }
};
