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
//! extern crate moxie_core;
//!
//! use std::path::Path;
//! use moxie_core as moxie;
//! use moxie::{
//!     model::{header::WillowHeader, event::Event, footer::WillowFooter},
//!     mock_env, gen::{make_gen, full_make_html},
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
//!     let (header, events, _footer) = mock_env();
//!     let html_str: String = full_make_html(header, events);
//!     let output_path = Path::new("etc/example_output.pdf");
//!     make_gen(html_str, output_path)
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
pub use model::{event::*, header::*};

/// Auto-imports
pub mod prelude {
    pub use super::model::{Client, User};
    pub use super::template::{Footer, Header, RowCol};
}

/// Contains template trait impls
pub mod template;

#[allow(missing_docs)]
fn make_shell_args() -> Result<(), std::io::Error> {
    use std::fs::File;
    use std::io::{Read, Write};
    use std::path::Path;

    let mut params = String::new();
    let mut client_json_file = File::open(Path::new("etc/client.json")).unwrap();
    client_json_file.read_to_string(&mut params).unwrap();
    params.push_str(" ");
    let mut events_json_file = File::open(Path::new("etc/events.json")).unwrap();
    events_json_file.read_to_string(&mut params).unwrap();
    params.push_str(" ");
    let mut user_json_file = File::open(Path::new("etc/user.json")).unwrap();
    user_json_file.read_to_string(&mut params).unwrap();

    let mut params_file = File::create("etc/shell_json.txt").unwrap();
    params_file.write(params.as_bytes()).unwrap();
    log::debug!("wrote params");
    Ok(())
}

/// A util function for mocking environment arguments, handy for testing & benches
pub fn mock_args_deser() -> (WillowHeader, Vec<Event>, model::footer::WillowFooter) {
    (
        WillowHeader::new(
            "Anne Proxy".to_string(),
            "anneproxy@skiff.com".to_string(),
            serde_json::json!("venmo: {0319301930913}, paypal: {09381093809831}"),
            "Brandon Belt".to_string(),
        ),
        Event::mock_deps(),
        model::footer::WillowFooter::new(200.50),
    )
}

/// Contains Moxie Errors
pub mod eh {
    use serde::{Deserialize, Serialize};

    /// Moxie EH (error handling) Custom Result type
    pub type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

    #[allow(missing_docs)]
    #[derive(Debug, Deserialize, Serialize)]
    pub enum OutLevel {
        INFO,
        DEBUG,
        WARN,
        CRITICAL,
    }

    #[allow(missing_docs)]
    #[derive(Debug, Deserialize, Serialize)]
    pub struct MoxieOutput {
        level: OutLevel,
        ctx: String,
    }

    impl MoxieOutput {
        #[inline]
        #[allow(missing_docs)]
        pub fn new(level: OutLevel, ctx: &str) -> Self {
            Self {
                level,
                ctx: ctx.to_string(),
            }
        }
    }

    impl std::fmt::Display for MoxieOutput {
        fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
            write!(f, "Moxie throw err: {}", self.ctx)
        }
    }

    impl std::error::Error for MoxieOutput {}
}

#[cfg(test)]
mod tests {
    use std::path::Path;

    #[test]
    fn make_header_test() {
        use super::WillowHeader;
        use crate::prelude::Header;

        pretty_env_logger::try_init().ok();

        let new_header = WillowHeader::new(
            "Anne Proxy".to_string(),
            "925-988-1298".to_string(),
            serde_json::json!("venmo: {092302930293}, paypal: {0924e98429084}"),
            "Joe Panik".to_string(),
        );
        log::debug!("Trying make_header with new_header: {:?}", new_header);
        let html_header = new_header.make_header();
        log::info!("Made html header: {}", html_header);
        crate::gen::make_gen(html_header, Path::new("etc/header_test.pdf")).unwrap()
    }
}
