import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { IPaymentInfo } from '../models/user-model';
import { page } from '../app';

export interface IFormatStringArg {
  date: Date;
  userName: string;
  userAddress?: string;
  userCityStateZip?: string;
  userPhone: string;
  userLicense: string;
  clientName: string;
  clientBalance: number | string;
  amountDue: number | string;
  note: string;
  paymentMethods: IPaymentInfo;
  events: Array<any>;
}

export default class Generator {
  htmlHead = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Statement Template</title>
    </head>`;
  htmlEnd = `
    </html>`;

  formatString(obj: IFormatStringArg) {
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    let headerSection = `<body>
    <main>
      <!-- header section -->
      <div id="heading">
        <h1>Account Statement</h1>
        <p id="date-section"><strong>Date: ${new Date(obj.date).toLocaleDateString('en-US', dateOptions)}</strong></p>
        <div class="container">
        <div class="row justify-content-center provider-info-section text-align-center">
          <div class="col-auto text-align-end" id="providerNameField">${obj.userName}</div>
          ${obj.userAddress.length > 0 ? `` : ''}
          
          ${
            obj.userCityStateZip.length > 0
              ? `<div class="col-auto bullet">&bull;</div><div class="col-auto text-align-start">${obj.userCityStateZip}</div>`
              : ''
          }
        </div>
        </div>
        <div class="row justify-content-center provider-info-section text-align-center">
          <div class="col-auto text-align-end">${obj.userPhone}</div>
          <div class="col-auto bullet">&bull;</div>
          <div class="col-auto text-align-start">${obj.userLicense}</div>
        </div>
        <div class="row" id="info-section">
          <div class="col client-info-section text-align-start">
            <!-- client section -->
            <div class="row">
              <p><strong>Client: </strong>${obj.clientName}</p>
            </div>
            <div class="row">
              <p><strong>Balance: </strong>${obj.clientBalance}</p>
            </div>
            <div class="row">
              ${obj.amountDue ? `<p><strong>Amount Due: </strong>${obj.amountDue}</p>` : ''}  
            </div>
            <div class="row" id="notes-field">
              ${obj.note ? `<p><strong>Note: </strong>${obj.note}</p>` : ''}
            </div>
          </div>
          <div class="col-lg-4" id="info-spacer"></div>
          <div class="col client-info-section payment-details-section text-align-start">
            <div class="row-1">
              <p><strong>Payment Methods</strong></p>
            </div>
            <div class="row-1 payment-details-section">
              ${obj.paymentMethods.check ? `<p><strong>Check: </strong>${obj.paymentMethods.check}</p>` : ''}
            </div>
            <div class="row-1">
              ${obj.paymentMethods.paypal ? `<p><strong>PayPal: </strong>${obj.paymentMethods.paypal}</p>` : ''}
            </div>
            <div class="row-1">
              ${obj.paymentMethods.venmo ? `<p><strong>Venmo: </strong>${obj.paymentMethods.venmo}</p>` : ''}
            </div>
            <div class="row-1">
              ${obj.paymentMethods.zelle ? `<p><strong>Zelle: </strong>${obj.paymentMethods.zelle}</p>` : ''}
            </div>
          </div>
        </div>
      </div>`;

    let tableSection = `    <!-- table section -->
    <div class="contain" id="table-container">
      <table class="table table-borderless">
        <!-- table header -->
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Type</th>
            <th scope="col">Duration</th>
            <th scope="col">Rate</th>
            <th scope="col">Amount</th>
            <th scope="col" class="text-align-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          ${obj.events
            .map((e) => {
              return `<tr>
                        <td>${new Date(e.date).toLocaleDateString('en-US')}</td>
                        <td>${e.type}</td>
                        <td>${e.duration ? e.duration : 'N/A'}</td>
                        <td>${e.rate ? `${e.rate}` : 'N/A'}</td>
                        <td>$${e.amount}</td>
                        <td class="text-align-right">$${e.newBalance}</td>
                      </tr>`;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  </main>
      </body>`;

    return this.htmlHead + headerSection + tableSection + this.htmlEnd;
  }

  saveFileFromString(str, path) {
    fs.writeFileSync(path, str);
  }

  async makePdfFromHtml(htmlStr: string, outputFile: string) {
    const genTime = 'Statement generated in';
    console.time(genTime);
    const launchTime = 'Puppeteer launched in: ';
    const styleTime = 'Style tags added in: ';
    const contentTime = 'Content set in: ';
    const pdfTime = 'PDF made in:';
    return new Promise(async (resolve, reject) => {
      try {
        // launch a new chrome instance
        console.time(launchTime);
        // create a new page

        console.timeEnd(launchTime);
        // set html as the pages content
        console.time(styleTime);
        await page.setContent(htmlStr, {
          waitUntil: 'domcontentloaded',
        });
        // link css and js
        await page.addScriptTag({
          path: path.resolve(__dirname, '../../public/javascripts/bootstrap.bundle.min.js'),
        });
        await page.addStyleTag({
          path: path.resolve(__dirname, '../../public/stylesheets/bootstrap.min.css'),
        });
        // await page.addStyleTag({
        //   url: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;500&display=swap",
        // })
        await page.addStyleTag({
          path: path.resolve(__dirname, '../../templates/statement.css'),
        });
        // wait for styles to load
        await page.evaluateHandle('document.fonts.ready');
        console.timeEnd(styleTime);
        console.time(pdfTime);
        // save file
        await page.pdf({
          format: 'Letter',
          margin: {},
          path: path.resolve(__dirname, `../../public/invoices/${outputFile}.pdf`),
        });
        console.timeEnd(pdfTime);
        // close the browser
        resolve(null);
        console.timeEnd(genTime);
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = Generator;
