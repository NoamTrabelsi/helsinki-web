export const catchHandler = (
    err: unknown,
    type: string,
    fanctionName: string,
    setError?: React.Dispatch<React.SetStateAction<string>>
  ): { error?: string; data?: unknown }| void => {
    const error = JSON.parse(JSON.stringify(err));
    console.log("full error",fanctionName, error);
    const errorJson = {
      type,
      message: "",
      fanctionName,
    };
  
    if (error?.meta?.cause) {
      errorJson.message = error.meta.cause;
    } else if (error?.message) {
      errorJson.message = error.message;
    } else if (error?.code) {
      errorJson.message = error.code;
    } else {
      errorJson.message = JSON.stringify(error);
    }
    console.log(fanctionName, errorJson.message);
    if (setError) {
      setError(JSON.stringify(errorJson));
    } else {
      return { error: JSON.stringify(errorJson) };
    }
  };
  