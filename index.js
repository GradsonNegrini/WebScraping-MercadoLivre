const pup = require('puppeteer'); //dependencia do puppeteer

const url = "https://mercadolivre.com.br/"; //url da requisicao dos dados via web scraping
const searchFor = "guitarra ibanez";
let c = 1; //contador de página

(async () => {
    const browser = await pup.launch({headless: false}) //abrindo navegador e passando propriedade para fazer de forma visual
    const page = await browser.newPage(); //abre uma nova pagina
    console.log("Iniciando...");

    await page.goto(url); //abre url
    console.log("Url aberta");

    await page.waitForSelector('#cb1-edit'); //aguarda ate que input seja carregado
    await page.waitForSelector('.nav-search-btn'); //aguarda ate que botao de click seja carregado

    await page.type('#cb1-edit',searchFor); //passa texto do seaxh for para input de pesquisa do ml
    console.log("Passando Texto")

    await Promise.all([  //Chamar dessa forma quando um evento for abrir uma proxima página
        page.waitForNavigation({ waitUntil: 'networkidle2' }), //garantindo que pagina esteja aberta e anterior fechada
        await page.click('.nav-search-btn')
    ]); 

        await page.waitForSelector('.ui-search-item__group__element.ui-search-link');
        console.log("Resultados de pesquisa carregados");

        const links = await page.$$eval('.ui-search-item__group__element.ui-search-link', links => links.map(link => link.href));
        console.log(links);

        for (let link of links){
            console.log('Página: ', c);
            await page.goto (link);
            await page.waitForSelector('.ui-pdp-title'); //aguarda ate que botao de click seja carregado
            await page.waitForSelector('.andes-money-amount__fraction'); //aguarda ate que botao de click seja carregado
            const title = await page.$eval ('.ui-pdp-title', element => element.innerText);
            const price = await page.$eval ('.andes-money-amount__fraction', element => element.innerText);
            console.log(title);
            console.log("R$: ",price);


            c++;

        }

    await browser.close(); //fecha browser
})();
