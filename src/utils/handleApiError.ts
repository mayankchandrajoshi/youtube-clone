import { isErrorInterface } from "@/interfaces/error";
import axios from "axios";

export default (error : any) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        return {
          code: error.response.status,
          message: error.response.data.message || 'Unknown server error' 
        };
      } else if (error.request) {
        // The request was made but no response was received
        return {
          code: 500,
          message: "Network error: No response from the server"
        };
      } else {
        // Something happened in setting up the request that triggered an error
        return {
          code: 500,
          message: "Network error: Request setup failed"
        };
      }
    } else if (isErrorInterface(error)) {
      return {
        code: error.code,
        message: changeCase(error.errors[0].reason)
      };
    } else if (error instanceof Error) {
        // Handle native JavaScript errors
        return {
          code: 400,
          message: error.message || "Unknown client error"
        };
    } else {
      return {
        code: 404,
        message: "Unknown error occurred"
      };
    }
  };


function changeCase(str : string) : string {
    // Split the string into words using whitespace as the delimiter
    const words = str.split("");
    // Capitalize the first letter of each word
    const capitalizedWords = words.map((word,index) => {
        if(index == 0 ) return word.toUpperCase();

        if(word === word.toUpperCase()){
            return " "+word.toLowerCase();
        }

        return word;
    });

    // Join the capitalized words back into a single string
    return capitalizedWords.join('');
}