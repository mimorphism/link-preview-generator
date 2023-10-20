# link-preview-generator
An application that generates link preview from a URL


**link-preview-generator** is an Express application built on top of [open-graph-scraper](https://github.com/jshemas/openGraphScraper)  that generates link preview from a url(via Open Graph,Twitter meta tags, and standard tags/properties that can be used to construct a preview)

## Getting Started
1. Install the npm dependencies
2.  run ```node app.js```
3.  Perform  a POST request to the endpoint ```/generatePreview``` with the following request body. The ```url``` field is an array, so put any number of URLs desired
    ```{
          "url": ["https://en.wikipedia.org/wiki/Hurricane_Willa"]
        }```
4. View the response
   ```[
	{
		"url": "https://en.wikipedia.org/wiki/Hurricane_Willa",
		"title": "Hurricane Willa - Wikipedia",
		"domain": "en.wikipedia.org",
		"description": "No Description",
		"image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Willa_2018-10-22_0850Z.jpg/1200px-Willa_2018-10-22_0850Z.jpg"
	}
]```
   
