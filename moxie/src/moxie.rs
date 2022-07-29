#![warn(clippy::todo, unused_mut)]
#![forbid(unsafe_code, unused_lifetimes, unused_mut)]
extern crate moxie;
use moxie::model::header;

/// TODO:
///
/// Simulate
/// [] local tests
/// [] bench
fn main() -> Result<(), anyhow::Error> {
    pretty_env_logger::try_init().ok();

    // Parse args into (Client, Vec<Event>, User)
    let (header_params, events, user_params) = moxie::gen::deserialize_payload()?;
    log::debug!("{:?}", header_params);
    log::debug!("{:?}", user_params);

    // Construct a WillowHeader from (Client, User)
    let header: header::WillowHeader =
        header::WillowHeader::try_from((header_params, user_params))?;
    // Fetch the 'new_balance' value at the last Event
    let _running_balance = events.last().unwrap().new_balance();
    log::debug!("{:?}", _running_balance);

    // Construct a statement from a WillowHeader and Vec<Event>
    let html = moxie::gen::full_make_html(header, events);
    log::debug!("full_make_html() done: {:?}", html);
    log::debug!("running gen::make_gen()");

    // Generate a PDF from out HTML string
    moxie::gen::make_gen(html, "etc/statement_test.pdf")?;

    Ok(())
}

#[cfg(test)]
mod payload_test {
    #[test]
    fn deserialize_payload() {
        use moxie::model::event::Event;
        use moxie::model::{Client, User};
        use std::{fs::File, io::Read, path::Path};

        pretty_env_logger::try_init().ok();
        // Parse into: Client
        {
            let mut client_json = File::open(Path::new("etc/client.json")).unwrap();
            let mut data = String::new();
            client_json.read_to_string(&mut data).unwrap();

            log::debug!("Deserializing client: {:?}", data);
            let c: Client = Client::try_from(data).unwrap();
            log::info!("Deserialized client: {:?} from ./etc/client.json", c);
        }
        // Parse into: Vec<Event>
        {
            let mut events_dump = File::open(Path::new("etc/events.json")).unwrap();
            let mut data = String::new();
            events_dump.read_to_string(&mut data).unwrap();

            log::debug!("Deserializing events dump...");
            let dump: Vec<Event> = Event::collect(data).unwrap();
            log::info!("Done. {:?}", dump)
        }
        // Parse into: User
        {
            let mut user_json = File::open(Path::new("etc/user.json")).unwrap();
            let mut data = String::new();
            user_json.read_to_string(&mut data).unwrap();

            log::debug!("Deserializing user...");
            let u: User = User::try_from(data).unwrap();
            log::info!("Done. {:?}", u)
        }
    }
}
