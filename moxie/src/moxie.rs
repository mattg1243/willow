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
    // let (header_params, events, user_params) = moxie::gen::deserialize_payload().unwrap_or_;
    match moxie::gen::deserialize_payload() {
        Ok((header_params, events, user_params)) => {
            log::debug!("{:?}", header_params);
            log::debug!("{:?}", user_params);
            match header::WillowHeader::try_from((header_params, user_params)) {
                Ok(header) => {
                    if let Some(rb) = events.last() {
                        log::debug!("running_balance: {:?}", rb);

                        let html = moxie::gen::full_make_html(header, events);
                        log::debug!("full_make_html() done: {:?}", html);
                        log::debug!("running moxie::gen::make_gen()");

                        match moxie::gen::make_gen(html, "./public/invoices/statement_test.pdf") {
                            Ok(()) => {
                                log::info!("made statement_test.pdf");
                                return Ok(());
                            }
                            Err(a) => {
                                let ctx = format!("statement_gen failed: {:?}", a);
                                log::error!("{}", ctx);
                                return Err(anyhow::Error::msg(ctx));
                            }
                        }
                    } else {
                        return Err(anyhow::Error::msg(
                            "Events could not be read, it may be an empty object.",
                        ));
                    }
                }
                Err(e) => {
                    log::error!("failed to gen header: {:?}", e);
                    return Err(e);
                }
            }
        }
        Err(e) => {
            let ctx = format!(
                "moxie throw err at: moxie::gen::deserialize_payload() [{:?}]",
                e
            );
            return Err(anyhow::Error::msg(ctx));
        }
    }
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
