#![warn(clippy::todo, unused_mut)]
#![forbid(unsafe_code, unused_lifetimes, unused_mut)]
extern crate moxie;
use moxie::eh::{MoxieOutput, OutLevel};
use moxie::model::header;

/// TODO:
///
/// Simulate
/// [] local tests
/// [] bench
fn main() -> Result<(), MoxieOutput> {
    pretty_env_logger::try_init().ok();
    std::env::set_var("RUST_LOG", "debug");
    std::env::set_var("RUST_BACKTRACE", "1");

    // Parse args into (Client, Vec<Event>, User)
    match moxie::gen::deserialize_payload() {
        // Deserialized
        Ok((header_params, events, user_params)) => {
            log::debug!("{:?}", header_params);
            log::debug!("{:?}", user_params);
            // Construct a Header
            match header::WillowHeader::try_from((header_params, user_params)) {
                // Constructed Header
                Ok(header) => {
                    if let Some(rb) = events.last() {
                        log::debug!("running_balance: {:?}", rb);

                        // Embed HTML
                        let html = moxie::gen::full_make_html(header, events);
                        log::debug!("full_make_html() done: {:?}", html);
                        log::debug!("running moxie::gen::make_gen()");

                        // Export PDF
                        match moxie::gen::make_gen(html, "./public/invoices/statement_test.pdf") {
                            // Export Good
                            Ok(()) => {
                                log::info!("made statement_test.pdf");
                                return Ok(());
                            }
                            // Throw:
                            //
                            // Export Bad
                            Err(a) => {
                                let ctx = format!("statement_gen failed: {:?}", a);
                                log::error!("{}", ctx);
                                return Err(MoxieOutput::new(OutLevel::CRITICAL, ctx.as_str()));
                            }
                        }
                    } else {
                        let ctx = format!("fetching running_balance failed");
                        log::error!("{}", ctx);
                        return Err(MoxieOutput::new(OutLevel::CRITICAL, ctx.as_str()));
                    }
                }
                // Throw:
                //
                // Failed constructing Header
                Err(e) => {
                    let ctx = format!("failed to gen header: {:?}", e);
                    log::error!("failed to gen header {:?}", ctx);
                    return Err(MoxieOutput::new(OutLevel::CRITICAL, ctx.as_str()));
                }
            }
        }
        // Throw:
        //
        // Deserializing failed
        Err(e) => {
            let ctx = format!(
                "moxie throw err at: moxie::gen::deserialize_payload() [{:?}]",
                e
            );
            log::error!("{}", ctx);
            return Err(MoxieOutput::new(OutLevel::CRITICAL, ctx.as_str()));
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
