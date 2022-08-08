#![warn(clippy::todo, unused_mut)]
#![forbid(unsafe_code, unused_lifetimes, unused_mut)]
extern crate moxie_core;
use moxie::eh::{MoxieOutput, OutLevel};
use moxie::model::header;
use moxie_core as moxie;

#[cfg(test)]
fn client() -> Result<(), anyhow::Error> {
    use std::io::Write;

    let c_raw = r#"{
        "fname": "Brandon",
        "lname": "Belt",
        "phonenumber": "9256756743",
        "balance": {
            "$numberDecimal": "250.00"
        },
        "email": "bbelt@gmail.com",
        "rate": {
            "$numberDecimal": "250.00"
        }
}"#;
    std::fs::File::create(std::path::Path::new("etc/client.txt"))
        .unwrap()
        .write(c_raw.as_bytes())
        .unwrap();
    let _c: moxie::model::Client = serde_json::from_str(c_raw).unwrap();
    Ok(())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    std::env::set_var("RUST_BACKTRACE", "1");
    pretty_env_logger::try_init().ok();
    let args: Vec<String> = std::env::args().collect();

    // Deserialize the Client params
    let header_params: moxie::model::Client = serde_json::from_str(&args[1].clone())?;
    // Deserialize the events dump
    let events: Vec<moxie::model::event::Event> = serde_json::from_str(&args[2].clone())?;
    log::debug!("{:?}", events);
    // Deserialize the User params
    let user_params: moxie::model::User = serde_json::from_str(&args[3].clone())?;

    // Construct the header
    let header: moxie::WillowHeader =
        moxie::WillowHeader::try_from((header_params, user_params)).unwrap();
    // Construct the statement
    let html: String = moxie::gen::full_make_html(header, events);
    moxie::gen::make_gen(html, "etc/test_main_statement.pdf")?;
    return Ok(());
}

#[cfg(test)]
mod payload_test {
    use super::moxie;

    #[test]
    fn run_client() {
        super::client().unwrap();
    }

    #[test]
    fn deserialize_raw_strings() {
        let c_raw = r#"{
            "fname": "Brandon",
            "lname": "Belt",
            "phonenumber": "9256756743",
            "balance": {
                "$numberDecimal": "250.00"
            },
            "email": "bbelt@gmail.com",
            "rate": {
                "$numberDecimal": "250.00"
            }
        }"#;
        let c: moxie::model::Client = moxie::model::Client::try_from(c_raw.to_string()).unwrap();
        let events_raw = r#"[
            { 
                "date": "2021-10-01T00:00:00.000Z", 
                "type": "Meeting",
                "duration": 1.5,
                "rate": 200,
                "amount": "-300.00",
                "newBalance": "-300.00",
                "__v": 0,
                "detail": "undefined" 
            },
            { 
                "date": "2021-10-06T00:00:00.000Z",
                "type": "4 Way Meeting",
                "duration": 1,
                "rate": 200,
                "amount": "-200.00",
                "newBalance": "-500.00",
                "__v": 0,
                "detail": "1:1" 
            },
            {
                "date": "2022-01-08T00:00:00.000Z",
                "type": "Meeting",
                "duration": 1,
                "rate": 200,
                "amount": "-200.00",
                "newBalance": "-4552.50",
                "__v": 0,
                "detail": "1:1" 
            }
        ]
        "#;
        let user_raw = r#"
            {
                "fname": "David",
                "lname": "Gallucci",
                "email": "scott.gallucci@gmail.com",
                "city": "Davis",
                "nameForHeader": "Scott Gallucci",
                "phone": "9253662139",
                "state": "CA",
                "street": "3215 Trawler Place",
                "zip": "95616",
                "paymentInfo": {
                    "check": "Please mail check to the above address",
                    "venmo": "scottg123",
                    "paypal": "Not yet specified",
                    "zelle": "Not yet specified"
                },
                "license": "MFC 42238"
            }
        "#;
        let (header_params, try_events, try_user_params) = (
            c,
            moxie::model::event::Event::collect(events_raw.to_string()),
            moxie::model::User::try_from(user_raw.to_string()),
        );

        match try_events {
            Ok(events) => {
                log::debug!("successfully deserialized events: {:?}", events);
            }
            Err(e) => {
                log::error!("panic at: failed to deserialize events: {:?}", e);
                panic!()
            }
        }

        match try_user_params {
            Ok(user) => {
                log::debug!("successfully deserialized user from raw_str: {:?}", user);
            }
            Err(e) => {
                log::error!("panic at: failed to deserialize user: {:?}", e);
                panic!()
            }
        }

        return;
    }

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
