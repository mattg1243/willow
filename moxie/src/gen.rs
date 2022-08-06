use super::eh::{MoxieOutput, OutLevel};
use crate::model::{event::Event, header::WillowHeader};
use crate::model::{Client, User};
use crate::template::{Header, RowCol};

use std::env;
use wkhtmltopdf::{Orientation, PdfApplication, Size};

/// Get env params for statement
pub fn deserialize_payload(args: Vec<String>) -> Result<(Client, Vec<Event>, User), MoxieOutput> {
    pretty_env_logger::try_init().ok();
    log::debug!("{:?}", args);
    // let c: Client = Client::try_from(args[0].clone())?;
    match Client::try_from(args[1].clone()) {
        Ok(c) => match Event::collect(args[2].clone()) {
            Ok(events) => match User::try_from(args[3].clone()) {
                Ok(u) => return Ok((c, events, u)),
                Err(e) => {
                    let ctx = format!("failed at deser user: {:?}", e);
                    return Err(MoxieOutput::new(OutLevel::CRITICAL, ctx.as_str()));
                }
            },
            Err(e) => {
                let ctx = format!("failed at collect events: {:?}", e);
                return Err(MoxieOutput::new(OutLevel::CRITICAL, ctx.as_str()));
            }
        },
        Err(e) => {
            let ctx = format!("failed at deser client: {:?}", e);
            return Err(MoxieOutput::new(OutLevel::CRITICAL, ctx.as_str()));
        }
    }
}

/// Example HTML -> PDF using wkhtmltopdf.
#[allow(dead_code)]
pub fn example_html_pdf() {
    let html = r#"<html><body><div>foo</div></body></html>"#;
    let pdf_app = PdfApplication::new().expect("failed to create PDF builder");
    let mut pdfout = pdf_app
        .builder()
        .orientation(Orientation::Portrait)
        .margin(Size::Inches(2))
        .title("Awesome Foo")
        .build_from_html(&html)
        .expect("failed to build pdf");

    pdfout.save("foo.pdf").expect("failed to save foo.pdf");
}

/// Table columns
pub static TABLE_COLUMNS: &str = "<!-- table section -->
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
pub static CLOSE_TABLE: &str = "</tbody></table></div>";

/// The closing tags to our HTML statement that will be appended at the end of the 'full_make_html()' function
pub static CLOSING_TAGS: &str = "</main></body>
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
pub fn full_make_html(h: WillowHeader, r: Vec<Event>) -> String {
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

    // Push the closing body tag and script field. Close the HTML tag to finalize our HTML statement
    html_str.push_str(CLOSING_TAGS);

    // Stop the runtime timer
    let runtime = start.elapsed();
    // Log results
    log::info!("returning html_str (after {:?}): {:?}", runtime, html_str);
    return html_str;
}

/// Generates a PDF repr from a String repr HTML
#[allow(dead_code)]
pub fn make_gen(html: String, out: &str) -> Result<(), std::io::Error> {
    let pdf_app = PdfApplication::new().expect("failed to create PDF builder");
    let mut pdfout = pdf_app
        .builder()
        .orientation(Orientation::Portrait)
        .margin(Size::Inches(2))
        .title("Awesome Foo")
        .build_from_html(html.as_str())
        .expect("failed to build pdf");

    let fail_msg = format!("failed to save {}", out.clone());
    pdfout.save(out).expect(fail_msg.as_str());
    Ok(())
}
