use crate::model::{event::Event, header::WillowHeader};

/// A rowcol component must impl this trait
pub trait RowCol {
    /// Convert an Event into a statement row
    fn make_row(&self) -> String;
}

/// A header component must impl this trait
pub trait Header {
    /// Convert client/provider info into a statement header
    fn make_header(&self) -> String;
}

/// A footer component must impl this trait
pub trait Footer {
    /// Construct a statement footer
    fn make_footer(&self) -> String;
}
/// Impl Header trait
impl Header for WillowHeader {
    fn make_header(&self) -> String {
        let mut html = String::new();
        html.push_str(&format!(
            "
            <html lang=\"en\">
            <head>
            <meta charset=\"UTF-8\" />
            <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
        <title>Statement Template</title>
        <link
          href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\"
          rel=\"stylesheet\"
          integrity=\"sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC\"
          crossorigin=\"anonymous\"
        />
        <link rel=\"stylesheet\" href=\"./styles.css\" />
        </head>
          <body>
            <main class=\"container\">
              <div class=\"container\" id=\"heading\">
                <h1>Account Statment</h1>
                <p>Date: July 24th, 2022</p>
                <div class=\"row justify-content-center provider-info-section\">
                  <div class=\"col-3\" id=\"providerNameField\">{prov}</div>
                  <div class=\"col-1\">&bull;</div>
                  <div class=\"col-3\">3215 Trawler Pl</div>
                  <div class=\"col-1\">&bull;</div>
                  <div class=\"col-3\">Davis, CA 95616</div>
                </div>
                <div class=\"row justify-content-center provider-info-section\">
                  <div class=\"col-3\">530-220-0242</div>
                  <div class=\"col-1\">&bull;</div>
                  <div class=\"col-3\">MFC 42238</div>
                </div>
                <div class=\"row\" id=\"info-section\">
                  <div class=\"col client-info-section\">
                    <!-- client section -->
                    <div class=\"row\">
                      <p><strong>Client: </strong>{client}</p>
                    </div>
                    <div class=\"row\">
                      <p><strong>Balance: </strong>$-650</p>
                    </div>
                    <div class=\"row\">
                      <p><strong>Amount Due: </strong>$2,650</p>
                    </div>
                    <div class=\"row\" id=\"notes-field\">
                      <p>
                        <strong>Note: </strong>why tf is thisasdfasdfasdf
                        asdfasdfasdfasdf shit
                      </p>
                    </div>
                  </div>
                  <div class=\"col\" id=\"info-spacer\"></div>
                  <div class=\"col client-info-section payment-details-section\">
                    <div class=\"row-1\">
                      <p><strong>Payment Methods</strong></p>
                    </div>
                    <div class=\"row-1\">
                      <p><strong>Check: </strong>Mail to adress above</p>
                    </div>
                    <div class=\"row-1\">
                      <p><strong>PayPal: </strong>vfrankel@gmail.com</p>
                    </div>
                    <div class=\"row-1\">
                      <p><strong>Venmo: </strong>vfrankel@gmail.com</p>
                    </div>
                    <div class=\"row-1\">
                      <p><strong>Zelle: </strong>5305555555</p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </body>
          <script
            src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js\"
            integrity=\"sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM\"
            crossorigin=\"anonymous\"
          ></script>",
            prov = self.provider(),
            client = self.client()
        ));
        return html;
    }
}

/// Impl RowCol trait (i.e. Description table)
impl RowCol for Event {
    fn make_row(&self) -> String {
        let mut html_table = String::new();

        // Push table Row
        html_table.push_str(&format!(
            "
            <tr>
                <td>{date}</td>
                <td>{event_type}</td>
                <td>{duration}</td>
                <td>{rate}</td>
                <td>{amount}</td>
                <td class=\"text-align-right\">{balance}</td>
            </tr>",
            date = self.date(),
            event_type = self.event_type(),
            duration = self.duration(),
            rate = self.peekrate(),
            amount = self.amount(),
            balance = self.new_balance()
        ));

        return html_table;
    }
}

/// Impl Footer trait (i.e. The statement footer)
impl Footer for super::model::footer::WillowFooter {
    fn make_footer(&self) -> String {
        let html_footer_str = String::new();
        return html_footer_str;
    }
}
