//!

#![warn(missing_docs)]
#![warn(unused_imports)]
#![forbid(unused_mut)]

/// Contains functions for building PDFs from HTML.
pub mod gen;

/// Contains the data model for events.
pub mod model;

/// Contains lowlevel functions for accepting environement JSON data,
/// converting it to a model, and embedding it into an HTML rowcol schema.
pub mod engine;

/// Example macros
#[macro_use]
use violetj2p_macro::streams;

/// Example usage of the attribute macro `streams` defined in violetj2p_macro
#[streams]
fn invoke1() {}

#[cfg(test)]
mod tests {
    use crate::gen::make_gen;
    use crate::model;

    #[test]
    fn parse_deps_test() {
        use super::engine;

        pretty_env_logger::try_init().ok();

        let args = model::Event::mock_args();

        let deps = engine::parse_deps(args);
        matches!(deps, Ok(_));
        log::info!("{:#?}", deps.unwrap());
    }

    #[test]
    fn mock_html_from_deps() {
        let mock_deps = vec![model::Event::mock(), model::Event::mock()];
        let mock_html = crate::engine::make_html(mock_deps).unwrap();
        log::info!("{}", mock_html);
        make_gen(mock_html, "mock_engine.pdf").unwrap();
    }

    #[test]
    fn attrib_macro() {
        super::invoke1()
    }
}
