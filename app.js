import express from 'express';
import { generatePreview } from './linkPreviewGenerator.js';
const app = express();
const port = 3500;
import cors from 'cors';
// import puppeteer from "puppeteer-extra";
// import pluginStealth from "puppeteer-extra-plugin-stealth";
import ogs from 'open-graph-scraper';




// events.setMaxListeners(300);

app.use(cors());
app.use(express.json());
// puppeteer.use(pluginStealth());
// const params = {
//   headless: "new",
//   args: ['--disable-gpu, --no-sandbox', '--disable-setuid-sandbox'],
//   executablePath: puppeteer.executablePath(),
// };



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
  // let browser = await puppeteer.launch(params);
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
    console.log("Moving to fallback processor GeneratePreview...");
    // let pages = browser.pages();
    // while (pages.length == 10) {
    //   pages = browser.pages();
    //   module.exports.delay(2000);
    // }try{
    // const generatePreviewResponse = await generatePreview(url, browser);
    //   if (generatePreviewResponse) {
    //     console.log("link succesfully processed!");
    //     return generatePreviewResponse;
    //   }
    // } catch (error) {

    //   console.error("Fatal error!Link absolutely cannot be processed: " + url);
    //   console.error(err);
     
    // }
  }
  finally{
    global.gc();
    console.error("=============================END==========================================");
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



