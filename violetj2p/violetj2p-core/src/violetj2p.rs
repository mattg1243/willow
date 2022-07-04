//! violetj2p.rs is the main executable that executes the following:
//!
//! 1. Deserializes command-line passed JSON structs into Vec<Event>
//! 2. Maps a Vec<Event> into a rowcol HTML schema and collect the HTML string,
//!    which is then returned as Ok(String) on success
//! 3. wkhtmltopdf HTML -> PDF
mod engine;
mod gen;
mod model;

use model::event::*;

fn main() -> Result<(), anyhow::Error> {
    pretty_env_logger::try_init().ok();
    let args = Event::mock_args();
    let html = engine::make_html(engine::parse_deps(args)?)?;
    log::info!("{}", html);
    gen::make_gen(html, "mock_engine.pdf")?;
    Ok(())
}
