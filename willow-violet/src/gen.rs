/// src/gen.rs defines primitives for generating statements.
///
/// i.e. includes the HTML/CSS schema for embedding client events within HTML
/// for maximum layout flexibility and quick serialization into PDF files.
use wkhtmltopdf::*;

/// Example HTML -> PDF using wkhtmltopdf.
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
