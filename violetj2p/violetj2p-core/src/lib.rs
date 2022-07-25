//! src/lib.rs defines trait implementations for generic Headers, RowCols, and Footers

#![warn(missing_docs)]
#![warn(unused_imports)]
#![forbid(unused_mut)]

/// Contains functions for building PDFs from HTML.
pub mod gen;

/// Contains the data model for events.
pub mod model;
use model::{
    header::WillowHeader,
    footer::WillowFooter,
    Header,
};

/// Contains lowlevel functions for accepting environement JSON data,
/// converting it to a model, and embedding it into an HTML rowcol schema.
pub mod engine;

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
          ></script>
        </html>",
            prov = self.provider(),
            client = self.client()
        ));
        return html;
    }
}

#[cfg(test)]
mod tests {
    use crate::model::event::*;

    #[test]
    fn parse_deps_test() {
        use super::engine;

        pretty_env_logger::try_init().ok();

        let args = Event::mock_args();

        let deps = engine::parse_deps(args);
        matches!(deps, Ok(_));
        log::info!("{:#?}", deps.unwrap());
    }

    #[test]
    fn make_header_test() {
        use super::{Header, WillowHeader};
        
        pretty_env_logger::try_init().ok();

        let new_header = WillowHeader::new(
            "Anne Proxy".to_string(),
            "925-988-1298".to_string(),
            "venmo: 8988989889".to_string(),
            "Joe Panik".to_string(),
        );
        log::debug!("Trying make_header with new_header: {:?}", new_header);
        let html_header = new_header.make_header();
        log::info!("Made html header: {}", html_header);
        crate::gen::make_gen(html_header, "header_test.pdf").unwrap()
    }
}
