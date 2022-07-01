//! `willow-violet` contains a suite of CI/CD scripts, benches, and tests
//! for the Willow project.

#![warn(missing_docs)]

/// Contains core functions for `willow-gen`, i.e. statement generation
pub mod gen;

/// Contains the schema interfaces to be used by `willow-gen`
pub mod model;

/// Contains the core engine that performs the logic encapsulated in `willow-gen`
pub mod engine {
    use super::*;

    /// Parses command line arguments into a Vec<Event>
    pub fn try_collect_env() -> Result<Vec<model::Event>, ()> {
        let args: Vec<String> = std::env::args().collect();
        let events: Vec<model::Event> = args
            .iter()
            .map(|arg| {
                let event: model::Event = serde_json::from_str(&arg).unwrap();
                event
            })
            .collect();
        Ok(events)
    }

    /// Generates a HTML representation from a Vec<Event>
    ///
    /// - Will need to have knowledge of our defined schema to
    ///   generate the event-embedded HTML.
    pub fn make_html(_events: Vec<model::Event>) -> &'static str {
        unimplemented!()
    }

    /// Generates a PDF representation from a &'static str HTML
    pub fn make_gen(_html: &'static str) -> Result<(), std::io::Error> {
        unimplemented!()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn gen_test() {
        gen::example_html_pdf()
    }
}
