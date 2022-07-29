//! violetj2p.rs is the main executable that executes the following:
//!
//! 1. Deserializes command-line passed JSON structs into Vec<Event>
//! 2. Maps a Vec<Event> into a rowcol HTML schema and collect the HTML string,
//!    which is then returned as Ok(String) on success
//! 3. wkhtmltopdf HTML -> PDF

#![warn(clippy::todo, unused_mut)]
#![forbid(unsafe_code, unused_lifetimes, unused_mut)]

mod gen;
mod model;

fn main() -> Result<(), anyhow::Error> {
    pretty_env_logger::try_init().ok();
    Ok(())
}

#[cfg(test)]
mod payload_test {
    #[test]
    fn deserialize_payload() {
        use super::model::event::Event;
        use super::model::Client;
        use std::{fs::File, io::Read, path::Path};

        pretty_env_logger::try_init().ok();

        {
            let mut client_json = File::open(Path::new("etc/client.json")).unwrap();
            let mut data = String::new();
            client_json.read_to_string(&mut data).unwrap();

            log::debug!("Deserializing client: {:?}", data);
            let c: Client = Client::try_from(data).unwrap();
            log::info!("Deserialized client: {:?} from ./etc/client.json", c);
        }

        {
            let mut events_dump = File::open(Path::new("etc/events.json")).unwrap();
            let mut data = String::new();
            events_dump.read_to_string(&mut data).unwrap();

            log::debug!("Deserializing events dump...");
            let dump: Vec<Event> = Event::collect(data).unwrap();
            log::info!("Done. {:?}", dump)
        }
    }
}
