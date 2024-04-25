export type IResponseError = {
  field?: string;
  kind: string;
  message: string;
};

type IResponse = {
  error?: IResponseError;
  data?: any;
};

export default IResponse;
