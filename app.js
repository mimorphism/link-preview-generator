import express from 'express';
const app = express();
const port = 3500;
import cors from 'cors';
import ogs from 'open-graph-scraper';





app.use(cors());
app.use(express.json());



app.listen(port, () => {
  console.log(`link-preview-generator running at http://localhost:${port}`)
})

app.get('/healthcheck/:greeting', (req, res) => {
  res.send(`WE UP! ${req.params.greeting}`)
})


app.post('/generatePreview', async (req, res) => {

  let urls = req.body.urls;
  console.log(urls);
  let linksToProcess = [];

  for (let url of urls) {
    linksToProcess.push(processLink(url));
  }



const result = await Promise.allSettled(linksToProcess);
const succeeded = result.filter(o => o.status === "fulfilled");
const failed = result.filter(o => o.status === "rejected");



  console.log("TOTAL LINK PROCESSED: " + urls.length);
  console.log("TOTAL SUCCESS: " + succeeded.length);
  console.log("TOTAL FAIL: " + failed.length);

  res.send(result.map(result => result.value));

});




 async function processLink(url) {
  console.log("request for link: " + url);
  const ogsOptions = {
    url: url,
    headers: { "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" },
  };
  try {
    console.log("trying with OpenGraphScraper...");
    const result = await ogs(ogsOptions);

    if (result.result.success) {
      console.log("succesful attempt for OpenGraphScraper");
      const ogResponse = result.result;

      const obj = {};
      obj.url = ogResponse.ogUrl;
      obj.title = ogResponse.ogTitle ? ogResponse.ogTitle : "No Title";
      obj.domain = getDomainRegex(ogResponse.ogUrl);
      obj.description = ogResponse.ogDescription ? ogResponse.ogDescription : "No Description";;
      obj.image = ogResponse.ogImage.url ? ogResponse.ogImage.url : "No Image";
      return obj;
    }

  } catch (error) {
    console.error("Error processing link");
  }
  finally{
    console.log("=============================END==========================================");
  }

  
}

const getDomainRegex = (url) => {
  console.log("getting domain for url: " + url);
  let matches = url ? url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i) : "No Domain";
  return matches && matches[1];  // domain will be null if no match is found

}


process.on('SIGINT', function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  // some other closing procedures go here
  process.exit(1);

});



