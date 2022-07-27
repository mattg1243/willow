/// Contains lowlevel functions for accepting environement JSON data,
/// converting it to a model, and embedding it into an HTML rowcol schema.
use super::*;
use model::{header::WillowHeader, event::Event, footer::WillowFooter};

/// Parses environment arguments into a Tuple(WillowHeader, Vec<Event>, WillowFooter)
#[allow(dead_code)]
pub fn parse_deps() -> Result<(WillowHeader, Vec<Event>, WillowFooter), anyhow::Error> {
    let args: Vec<String> = std::env::args().collect();

    let wheader: WillowHeader = serde_json::from_str(&args[0]).unwrap();
    let events: Vec<Event> = serde_json::from_str(&args[1]).unwrap();
    let wfooter: WillowFooter = serde_json::from_str(&args[2]).unwrap();

    Ok((wheader, events, wfooter))
}

