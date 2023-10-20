# link-preview-generator
An application that generates link preview from a URL


**link-preview-generator** is an Express application that generates link preview from a url via the Open Graph and Twitter Card metadata

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
   
