# fcc-image-search
An interface to the Google Custom Search API. Returns image links and metadata as JSON.

## Example uses

### Search
Pass your request to the /search endpoint to search. You may add an offset to
get further results. Each page is an offset of a multiple of 10.

    https://cryptic-castle-1280.herokuapp.com/search/funny%20cats
    https://cryptic-castle-1280.herokuapp.com/search/tacos?offset=10
    
### View recent searches
You may view this API's recent searches by calling the /latest endpoint

    https://cryptic-castle-1280.herokuapp.com/latest