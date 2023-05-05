export type ResponseError = {
  field?: string;
  kind: string;
  message: string;
};

type Response = {
  error?: ResponseError;
  data?: any;
};

export default Response;
