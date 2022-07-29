//! To construct an HTML statement within violetj2p, three params are required:
//!
//! - A `WillowHeader` struct
//! - A `Vec<Event>`
//! - A `WillowFooter` struct
//!
//! The flow is as follows:
//! - invoke `full_make_html(h, r, f)` where
//! `h: WillowHeader`
//! `r: Vec<Event>`
//! `f: WillowFooter`
//!
//! - `full_make_html(h,r,f)` will return an HTML representation of the three
//! input params using the templates within the three trait impls (i.e. the traits:
//! Header, RowCol, and Footer).
//!
//! - once the HMTL string is acquired from the `full_make_html(h,r,f)` call,
//! the string is then passed into `gen::make_gen(html_str, output_path)`. This `make_gen()`
//! function returns: `Result<(), std::io::Error>` because the Ok result can be safely discarded
//! (i.e. we only care about the return value of this function if it has failed).
//!
//! Further documentation of each Trait, Struct, and Function can be found by viewing the source
//! for the library, or by clicking on each module seperately.
//!
//! An example main.rs utilizing violetj2p for our statement engine may look like this:
//!
//! This test will currently fail, as the `parse_deps` function hasn't been properly impl yet.
//! ```rust
//! extern crate moxie;
//!
//! use moxie::{
//!     model::{header::WillowHeader, event::Event, footer::WillowFooter},
//!     mock_env, full_make_html, gen::make_gen,
//! };
//!
//! fn main() -> Result<(), std::io::Error> {
//!     let args: Vec<String> = std::env::args().collect();
//!     // This will collect the environment arguments and deserialize the JSON
//!     // dumps into their respected objects.
//!     //
//!     // It is commented out because the doc test cannot acquire environment arguments.
//!     // let (header, events, footer):
//!     // (WillowHeader, Vec<Event>, WillowFooter) = parse_deps().unwrap();
//!
//!     // Here we use the 'mock_env' function to mock the deps that we would (in a real
//!     // environment) acquire from the above code (i.e. the invocation of 'parse_deps')
//!     let (header, events, footer) = mock_env();
//!     let html_str: String = full_make_html(header, events, footer);
//!     make_gen(html_str, "etc/example_output.pdf")
//! }
//! ```

// --------- END OUTER DOCS -------------
#![warn(missing_docs)]
#![warn(dead_code)]
#![warn(unused_imports)]
#![forbid(unused_mut)]

/// Re-exports
pub use self::mock_args_deser as mock_env;

/// Contains functions for building PDFs from HTML.
pub mod gen;
pub use self::gen::make_gen;

/// Contains the data model for events.
pub mod model;
pub use self::model::{
    event::Event, footer::WillowFooter, header::WillowHeader, Footer, Header, RowCol,
};

/// Table columns
static TABLE_COLUMNS: &str = "<!-- table section -->
      <div class=\"contain\" id=\"table-container\">
        <table class=\"table table-borderless\">
          <!-- table header -->
          <thead>
            <tr>
              <th scope=\"col\">Date</th>
              <th scope=\"col\">Type</th>
              <th scope=\"col\">Duration</th>
              <th scope=\"col\">Rate</th>
              <th scope=\"col\">Amount</th>
              <th scope=\"col\" class=\"text-align-right\">Balance</th>
            </tr>
          </thead>
          <tbody>";

/// Table closing tags
/// These are appended after the Vec<Event> has been traversed
static CLOSE_TABLE: &str = "</tbody></table></div>";

/// The closing tags to our HTML statement that will be appended at the end of the 'full_make_html()' function
static CLOSING_TAGS: &str = "</main></body>
  <script
    src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js\"
    integrity=\"sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM\"
    crossorigin=\"anonymous\"
  ></script>
</html>";

/// This is the core function that accepts all params necessary to generate a full statement
///
/// The procedure relies on the trait implementations. It first constructs a mutable String:
/// 'html_str', uses the make_header function on the WillowHeader struct to create and push
/// the HTML header. Then it loops through r (Vec<Event>), constructing a RowCol object
/// for each Event in r, pushing each row as they are made. Finally, a WillowFooter is converted
/// into a generic Footer object then pushed to the 'html_str', and a final '</html>' closing tag
/// is appended.
pub fn full_make_html(h: WillowHeader, r: Vec<Event>, f: WillowFooter) -> String {
    // Set up the logger environement
    pretty_env_logger::try_init().ok();
    // Start the runtime clock
    let start = std::time::Instant::now();

    // Construct a mutable string to push our HTML to
    let mut html_str = String::new();
    log::debug!("{:?}", h);
    // Use the Header trait impl to construct the HTML header from the WillowHeader
    // struct that was passed into this function
    let header: String = h.make_header();
    log::debug!("{:?}", header);
    // Push the HTML header to our string
    html_str.push_str(header.as_str());

    // Push the Table columns before constructing the rows
    html_str.push_str(TABLE_COLUMNS);

    // Iteratively construct our description tables rows using
    // the RowCol impl. This current impl will construct as many rows
    // as there are 'Event' in 'r'. May want to think about this later because
    // if there are an irrational amount of events being passed then the function
    // may want to decide a breaking point to suspend any further rows from being
    // constructed. (i.e. maybe a constraint on how many events can be used to construct)
    // a statement in order to prevent a DOS attack. But a constraint limits the users
    // freedom so I think it's a tricky thing.
    for e in r {
        log::debug!("{:?}", e);
        let row = e.make_row();
        log::debug!("{:?}", row);
        html_str.push_str(row.as_str());
    }
    // Close the table
    html_str.push_str(CLOSE_TABLE);

    // Construct the HTML statement footer
    let footer: String = f.make_footer();
    log::debug!("{:?}", footer);
    html_str.push_str(footer.as_str());
    // Push the closing body tag and script field. Close the HTML tag to finalize our HTML statement
    html_str.push_str(CLOSING_TAGS);

    // Stop the runtime timer
    let runtime = start.elapsed();
    // Log results
    log::info!("returning html_str (after {:?}): {:?}", runtime, html_str);
    return html_str;
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
impl Footer for WillowFooter {
    fn make_footer(&self) -> String {
        let html_footer_str = String::new();
        return html_footer_str;
    }
}

/// A util function for mocking environment arguments, handy for testing & benches
pub fn mock_args_deser() -> (WillowHeader, Vec<Event>, WillowFooter) {
    (
        WillowHeader::new(
            "Anne Proxy".to_string(),
            "anneproxy@skiff.com".to_string(),
            "venmo: 908278409274".to_string(),
            "Brandon Belt".to_string(),
        ),
        Event::mock_deps(),
        WillowFooter::new(200.50),
    )
}

#[cfg(test)]
mod tests {
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
        crate::gen::make_gen(html_header, "etc/header_test.pdf").unwrap()
    }
}
