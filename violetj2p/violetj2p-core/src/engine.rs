/// Contains lowlevel functions for accepting environement JSON data,
/// converting it to a model, and embedding it into an HTML rowcol schema.
use super::*;
use model::event::Event;

/// Parses command line arguments into a Vec<Event>
#[allow(dead_code)]
pub fn parse_deps(args: Vec<String>) -> Result<Vec<Event>, anyhow::Error> {
    let mut deps: Vec<Event> = vec![];
    for s in args.iter() {
        // Here, our TryFrom<String> implementations for the Event type attempts
        // to deserialize the command-line passed json String into a model::Event.
        let e = Event::try_from(s.to_string())?;
        deps.push(e);
    }
    Ok(deps)
}