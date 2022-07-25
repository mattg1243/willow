/// src/gen.rs defines primitives for generating statements.
///
/// i.e. includes the HTML/CSS schema for embedding client events within HTML
/// for maximum layout flexibility and quick serialization into PDF files.
use wkhtmltopdf::{Orientation, PdfApplication, Size};

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
