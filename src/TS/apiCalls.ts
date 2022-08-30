import fetch from 'electron-fetch';

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
