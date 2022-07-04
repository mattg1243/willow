#![allow(dead_code)]

use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;

/// A rowcol component must impl this trait
#[allow(missing_docs)]
pub trait RowCol {
    fn j2phtml(&self) -> String;
}

/// A header component must impl this trait
#[allow(missing_docs)]
pub trait Header {
    fn j2phtml(&self) -> String;
}

/// A footer component must impl this trait
#[allow(missing_docs)]
pub trait Footer {
    fn j2phtml(&self) -> String;
}

/// A finalized statement in HTML repr
#[derive(Debug, Deserialize, Serialize)]
pub struct HtmlStatement<H, R, F>
where
    H: Header,
    R: RowCol,
    F: Footer,
{
    /// The header component
    pub header: H,
    /// The body component
    pub rows: Vec<R>,
    /// The footer component
    pub footer: F,
}

impl<H, R, F> HtmlStatement<H, R, F>
where
    H: Header,
    R: RowCol,
    F: Footer,
{
    /// Construct a finalized statement from parts
    pub fn new(header: H, rows: Vec<R>, footer: F) -> Self {
        HtmlStatement {
            header,
            rows,
            footer,
        }
    }
}

/// The schema for the willow::Event record.
#[derive(Debug, Deserialize, Serialize)]
#[allow(missing_docs)]
pub struct Event {
    #[serde(rename = "ownerID")]
    owner_id: String,
    #[serde(rename = "clientID")]
    client_id: String,
    date: String,
    #[serde(rename = "type")]
    event_type: String,
    duration: u8,
    rate: u16,
    amount: JsonValue,
    #[serde(rename = "newBalance")]
    new_balance: f64,
}

impl RowCol for Event {
    fn j2phtml(&self) -> String {
        // HTML rowcol schema goes here:

        unimplemented!()
    }
}

/// Event Accessors:
#[allow(missing_docs, dead_code)]
impl Event {
    pub fn owner_id(&self) -> &str {
        &self.owner_id
    }

    pub fn client_id(&self) -> &str {
        &self.client_id
    }

    pub fn date(&self) -> &str {
        &self.date
    }

    pub fn event_type(&self) -> &str {
        &self.event_type
    }

    pub fn duration(&self) -> u8 {
        self.duration
    }

    pub fn rate(&self) -> u16 {
        self.rate
    }

    pub fn amount(&self) -> &JsonValue {
        &self.amount
    }

    pub fn new_balance(&self) -> f64 {
        self.new_balance
    }

    /// Returns the raw string repr of the object.
    pub fn raw(&self) -> &str {
        r#"{
                "ownerID": "owner_id",
                "clientID": "client_id",
                "date": "date",
                "type": "event_type",
                "duration": 0,
                "rate": 0,
                "amount": null,
                "newBalance": 0.0
            }"#
    }
}

/// Useful mock funcs for testing purposes.
#[allow(dead_code)]
impl Event {
    /// Returns a mock Event object.
    pub fn mock() -> Event {
        Event {
            owner_id: "owner_id".to_string(),
            client_id: "client_id".to_string(),
            date: "date".to_string(),
            event_type: "event_type".to_string(),
            duration: 0,
            rate: 0,
            amount: JsonValue::Null,
            new_balance: 0.0,
        }
    }

    /// Returns a mock Vec<Event>.
    pub fn mock_deps() -> Vec<Event> {
        vec![Event::mock(), Event::mock(), Event::mock()]
    }

    /// Returns a mock Vec<String> repr JSON-encoded Event objects
    /// passed from Node.
    pub fn mock_args() -> Vec<String> {
        vec![
            "{
                \"ownerID\": \"owner_id\",
                \"clientID\": \"client_id\",
                \"date\": \"date\",
                \"type\": \"event_type\",
                \"duration\": 0,
                \"rate\": 0,
                \"amount\": null,
                \"newBalance\": 0.0
            }"
            .to_string(),
            "{
                \"ownerID\": \"owner_id\",
                \"clientID\": \"client_id\",
                \"date\": \"date\",
                \"type\": \"event_type\",
                \"duration\": 0,
                \"rate\": 0,
                \"amount\": null,
                \"newBalance\": 0.0
            }"
            .to_string(),
        ]
    }
}

/// An implementation of the TryFrom<String> trait for Event.
impl TryFrom<String> for Event {
    type Error = anyhow::Error;

    fn try_from(s: String) -> Result<Event, Self::Error> {
        let event: Event = serde_json::from_str(&s)?;
        Ok(event)
    }
}
