/// src/gen.rs defines primitives for generating statements.
///
/// i.e. includes the HTML/CSS schema for embedding client events within HTML
/// for maximum layout flexibility and quick serialization into PDF files.
use wkhtmltopdf::{Orientation, PdfApplication, Size};
use crate::model::{header::WillowHeader, event::Event, footer::WillowFooter};

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

/// Parses environment arguments into a Tuple(WillowHeader, Vec<Event>, WillowFooter)
#[allow(dead_code)]
pub fn parse_deps() -> Result<(WillowHeader, Vec<Event>, WillowFooter), anyhow::Error> {
    let args: Vec<String> = std::env::args().collect();

    let wheader: WillowHeader = serde_json::from_str(&args[0]).unwrap();
    let events: Vec<Event> = serde_json::from_str(&args[1]).unwrap();
    let wfooter: WillowFooter = serde_json::from_str(&args[2]).unwrap();

    Ok((wheader, events, wfooter))
}

