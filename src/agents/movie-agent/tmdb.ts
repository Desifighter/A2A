
/**
 * Utility function to call the OMDb API
 * @param endpoint Fake endpoint used for compatibility ('movie' or 'person')
 * @param query The search query
 * @returns Promise that resolves to the API response data
 */
export async function callTmdbApi(endpoint: string, query: string) {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    throw new Error("OMDB_API_KEY environment variable is not set");
  }

  try {
    const url = new URL("https://www.omdbapi.com/");
    url.searchParams.append("apikey", apiKey);

    // OMDb doesn't have separate person/movie endpoints, we'll adapt logic:
    if (endpoint === "movie") {
      url.searchParams.append("s", query); // search by title
      url.searchParams.append("type", "movie");
    } else if (endpoint === "person") {
      // OMDb does not support person search – simulate with title search
      url.searchParams.append("s", query); // fallback to title search
    } else {
      throw new Error(`Unsupported endpoint: ${endpoint}`);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(
        `OMDb API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.Response === "False") {
      throw new Error(`OMDb error: ${data.Error}`);
    }

    return {
      results: data.Search || [],
      totalResults: data.totalResults || 0,
    };
  } catch (error) {
    console.error(`Error calling OMDb API (${endpoint}):`, error);
    throw error;
  }
}

// /**
//  * Utility function to call the TMDB API
//  * @param endpoint The TMDB API endpoint (e.g., 'movie', 'person')
//  * @param query The search query
//  * @returns Promise that resolves to the API response data
//  */
// export async function callTmdbApi(endpoint: string, query: string) {
//   // Validate API key
//   const apiKey = process.env.OMDB_API_KEY;
//   if (!apiKey) {
//     throw new Error("OMDB_API_KEY environment variable is not set");
//   }

//   try {
//     // Make request to TMDB API
//     const url = new URL(`https://api.themoviedb.org/3/search/${endpoint}`);
//     url.searchParams.append("api_key", apiKey);
//     url.searchParams.append("query", query);
//     url.searchParams.append("include_adult", "false");
//     url.searchParams.append("language", "en-US");
//     url.searchParams.append("page", "1");

//     const response = await fetch(url.toString());

//     if (!response.ok) {
//       throw new Error(
//         `TMDB API error: ${response.status} ${response.statusText}`
//       );
//     }

//     return await response.json();
//   } catch (error) {
//     console.error(`Error calling TMDB API (${endpoint}):`, error);
//     throw error;
//   }
// }
