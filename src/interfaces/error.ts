export interface ErrorInterface {
    code : number,
    message : string,
    errors: {
        message: string,
        domain: string,
        reason: string
    }[]
}


// Type guard function to check if error object adheres to ErrorInterface
export function isErrorInterface(obj: any): obj is ErrorInterface {
    return (
      typeof obj === 'object' &&
      'code' in obj &&
      typeof obj.code === 'number' &&
      'message' in obj &&
      typeof obj.message === 'string' &&
      'errors' in obj &&
      Array.isArray(obj.errors) &&
      obj.errors.every(
        (err: any) =>
          typeof err === 'object' &&
          'message' in err &&
          typeof err.message === 'string' &&
          'domain' in err &&
          typeof err.domain === 'string' &&
          'reason' in err &&
          typeof err.reason === 'string'
      )
    );
  }
  