export interface IErrorResponse {
  [key: string]: any;
  statusCode: number;
  error: {
    message: string;
    code?: number; // optional, FE uses this to map to application specific message
    validationErrors?: {
      field: string;
      error: string;
    }[];
    data?: any;
  };
}

export interface IDataResponse<OutputEntity = any> {
  [key: string]: any;
  statusCode: number;
  data: {
    result: OutputEntity;
    totalCount: number;
  };

  // TODO replace data with this once refactor is done
  // data: IDataItem<Entity> | IDataItems<Entity>;
}

export interface IContentResponse {
  [key: string]: any;
  statusCode: number;
  data: Buffer;
  contentType: string;
}

export interface IFileResponse extends IContentResponse {
  contentDisposition: string;
}

export interface IDataItem<T> {
  item: T;
}

export interface IDataItems<T> {
  items: T[];
  totalCount: number;
  limit: number;
  offset: number;
}

export type ApiResponse<E> = IErrorResponse | IDataResponse<E> | IFileResponse | IDataItems<E>;
