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
}
