import fetch from 'electron-fetch';
/**
 * attempts to make an api call to the specified url.
 * @throws error if the api fails to return or returns a code outside the 200 range
 * @throws error if the api does not return readable json 
 */
export const makeApiCall = async (siteUrl: string): Promise<JSON> => {
  let result = await fetch(siteUrl)
  if (!result.ok) {
    throw new Error("invalid response from server. error code:" + result.status + " " + result.statusText)
  }
  try {
    let returnedJson = await result.json()
    return returnedJson
  }
  catch {
    throw new Error("failed to retrieve json contents of api response")
  }
}
