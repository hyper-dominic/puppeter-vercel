const app = require("express")();

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.get("/api/codeBlock", async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
//       defaultViewport: chrome.defaultViewport,
       defaultViewport: {
      width: 1280,
      height: 720,
      deviceScaleFactor: 1,
    },
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    
//     let {language , code , width , bg ,pv,ph,theme } = req.query
    
    
//     console.log({language , code , width , bg ,pv,ph,theme});
    
//    let terminalConfig = {
//   width: width||"680",
//   bg: bg||"rgba(171, 184, 195, 1)",
//   theme: theme||"seti",
//   paddingVertical: pv||"56",
//   paddingHorizontal: ph||"56",
// };

// let CodeBlock = {
//   language: language||"javascript",
//   code: code||`console.log("Its Me Shubham")`,
// };
    
    let CodeBlock = {
  title: "index.js",
  transparent: false,
  padding: "64",
  theme: "candy",
  dark: "true",
  language: "javascript",
  code: `console.log("Its Jarvis") `,
};
    
    CodeBlock = {...CodeBlock,...req.query}
    
//     const url = `https://carbon.now.sh/?bg=rgba%28171%2C+184%2C+195%2C+1%29&t=seti&wt=none&l=${CodeBlock.language}&width=${terminalConfig.width}&ds=true&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=${terminalConfig.paddingVertical}px&ph=${terminalConfig.paddingHorizontal}px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=4x&wm=false&code=${CodeBlock.code}`;
const url = `https://ray.so/#width=null&code=${Buffer.from(CodeBlock.code).toString('base64')}&language=${
  CodeBlock.language
}&theme=${CodeBlock.theme}&background=${!CodeBlock.transparent}&darkMode=${
  CodeBlock.dark
}&padding=${CodeBlock.padding}&title=${CodeBlock.title}`;

    // Configures puppeteer
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
//     console.log("page", page);
    // await page.setUserAgent(
    //   "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    // );
    await page.goto(url, {
      timeout: 30000,
//       waitUntil: "load",
    });

//     await page.setRequestInterception(true);
    page.on("request", async (request) => {
//       console.log("request", request);
      
         if (request.url().includes("data:image/")) {
           
           
           
           let image = request.url();
           res.send({ image });
           

        await browser.close();
         }else{
           
//            request.continue();
         }
        
      
    });
    
//     const source = await page.$(".jsx-2184717013");
      const source = await page.$(".ExportButton_button__d___t");

//     await page.waitForSelector("#play-now");
//     const play = await page.$("#play-now");

    // console.log(play);
    source.click();
//     await page.waitForTimeout(1);
//     await play.click();
  } catch (e) {
    console.error("error mine", e);
    res.send("Something Went Wrong");
  }
});

app.get("/api/test", async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    let id = req.query.tmdb;
    console.log(id);

    // Configures puppeteer
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    // console.log("page", page);
    // await page.setUserAgent(
    //   "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    // );
    await page.goto(`https://www.2embed.to/embed/tmdb/movie?id=${id}`, {
      timeout: 10000,
      waitUntil: "load",
    });

    res.send(page.title());
  } catch (e) {
    console.error("error mine", e);
    res.send("Something Went Wrong");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
