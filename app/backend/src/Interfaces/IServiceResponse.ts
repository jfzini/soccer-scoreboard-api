enum StatusHTTP {
  SUCCESSFUL = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

type DataResponse<T> = T | T[] | null | { message?: string, token?: string };

interface IServiceResponse<T> {
  status: keyof typeof StatusHTTP;
  data: DataResponse<T>;
}

export { StatusHTTP, IServiceResponse };
