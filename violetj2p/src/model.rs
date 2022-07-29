#![allow(dead_code)]
#![warn(missing_docs)]

use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;

/// Client payload
#[derive(Debug, Deserialize, Serialize)]
pub struct Client {
    #[serde(rename = "_id")]
    mongo_id: String,
    #[serde(rename = "ownerID")]
    owner_id: String,
    fname: String,
    lname: String,
    phonenumber: String,
    sessions: Vec<String>,
    balance: String,
    #[serde(rename = "__v")]
    v: usize,
    email: String,
    rate: String,
    #[serde(rename = "isArchived")]
    is_archived: bool,
    id: String,
}

impl TryFrom<String> for Client {
    type Error = anyhow::Error;

    fn try_from(value: String) -> Result<Client, Self::Error> {
        Ok(serde_json::from_str(value.as_str())?)
    }
}

impl Client {
    fn concat_prov(&self) -> String {
        let mut cat = String::new();
        cat.push_str(self.fname.as_str());
        cat.push_str(" ");
        cat.push_str(self.lname.as_str());
        return cat;
    }
    fn balance(&self) -> String {
        self.balance.clone()
    }
    fn email(&self) -> String {
        self.email.clone()
    }
    fn rate(&self) -> String {
        self.rate.clone()
    }
}

/// A rowcol component must impl this trait
pub trait RowCol {
    /// Convert an Event into a statement row
    fn make_row(&self) -> String;
}

/// A header component must impl this trait
pub trait Header {
    /// Convert client/provider info into a statement header
    fn make_header(&self) -> String;
}

/// A footer component must impl this trait
pub trait Footer {
    /// Construct a statement footer
    fn make_footer(&self) -> String;
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
    /// Construct a new statement from parts
    pub fn new(header: H, rows: Vec<R>, footer: F) -> Self {
        HtmlStatement {
            header,
            rows,
            footer,
        }
    }
}

impl<H, R, F> From<(H, Vec<R>, F)> for HtmlStatement<H, R, F>
where
    H: Header,
    R: RowCol,
    F: Footer,
{
    fn from(tup: (H, Vec<R>, F)) -> HtmlStatement<H, R, F> {
        Self {
            header: tup.0,
            rows: tup.1,
            footer: tup.2,
        }
    }
}

/// Defines an event schema & its methods
pub mod event {
    use super::{Deserialize, JsonValue, Serialize};

    /// The schema for the willow::Event record.
    #[derive(Debug, Deserialize, Serialize)]
    #[allow(missing_docs)]
    pub struct Event {
        #[serde(rename = "_id")]
        id: String,
        #[serde(rename = "clientID")]
        client_id: String,
        date: String,
        #[serde(rename = "type")]
        event_type: String,
        duration: f32,
        rate: Option<u32>,
        amount: JsonValue,
        #[serde(rename = "newBalance")]
        new_balance: String,
    }

    /// Event Accessors:
    #[allow(missing_docs, dead_code)]
    impl Event {
        pub fn new(
            id: &str,
            client_id: &str,
            date: &str,
            etype: &str,
            duration: f32,
            rate: Option<u32>,
            amount: JsonValue,
            new_balance: &str,
        ) -> Self {
            Self {
                id: id.to_owned(),
                client_id: client_id.to_owned(),
                date: date.to_owned(),
                event_type: etype.to_owned(),
                duration,
                rate,
                amount,
                new_balance: new_balance.to_owned(),
            }
        }

        pub fn collect(json_dump: String) -> Result<Vec<Self>, anyhow::Error> {
            return Ok(serde_json::from_str(json_dump.as_str())?)
        }

        pub fn mock_deps() -> Vec<Self> {
            let mut mock: Vec<Self> = vec![];
            for _ in 0..10 {
                mock.push(Self::new(
                    "f901309830913",
                    "4790194704971",
                    "07/22/2022",
                    "Meeting",
                    2f32,
                    Some(90u32),
                    serde_json::json!("amount: {200}"),
                    "200.50",
                ))
            }
            return mock;
        }

        pub fn date(&self) -> &str {
            &self.date
        }
        pub fn event_type(&self) -> &str {
            &self.event_type
        }
        pub fn duration(&self) -> f32 {
            self.duration
        }
        pub fn rate(&self) -> Option<u32> { self.rate }
        pub fn peekrate(&self) -> String {
            if let Some(r) = self.rate() {
                r.to_string()
            } else {
                String::from("")
            } 
        }
        pub fn amount(&self) -> &JsonValue {
            &self.amount
        }
        pub fn new_balance(&self) -> String {
            self.new_balance.clone()
        }

        /// Returns the string repr of the object.
        pub fn stringify(&self) -> String {
            serde_json::to_string_pretty(self).unwrap()
        }
    }

    /// Useful mock funcs for testing purposes.
    #[allow(dead_code)]
    impl Event {
        /// Returns a mock Event object.
        pub fn mock() -> Event {
            Event {
                id: "owner_id".to_string(),
                client_id: "client_id".to_string(),
                date: "date".to_string(),
                event_type: "event_type".to_string(),
                duration: 0f32,
                rate: None,
                amount: JsonValue::Null,
                new_balance: String::from("100"),
            }
        }

        /// Returns a mock Vec<Event>.
        pub fn mock_three() -> Vec<Event> {
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

    impl TryInto<String> for Event {
        type Error = anyhow::Error;

        fn try_into(self) -> Result<String, Self::Error> {
            let s = serde_json::to_string_pretty(&self)?;
            Ok(s)
        }
    }
}

#[allow(missing_docs)]
/// Defines the WillowHeader struct & its methods
pub mod header {
    use super::{Deserialize, Serialize};

    #[derive(Debug, Deserialize, Serialize)]
    pub struct WillowHeader {
        provider: String,
        contact: String,
        billing: String,
        client: String,
    }

    impl From<super::Client> for WillowHeader {
        fn from(c: super::Client) -> WillowHeader {
            todo!()
        }
    }

    impl WillowHeader {
        pub fn new(provider: String, contact: String, billing: String, client: String) -> Self {
            WillowHeader {
                provider,
                contact,
                billing,
                client,
            }
        }

        /// Accessors:
        pub fn provider(&self) -> String {
            self.provider.clone()
        }

        pub fn contact(&self) -> String {
            self.contact.clone()
        }

        pub fn billing(&self) -> String {
            self.billing.clone()
        }

        pub fn client(&self) -> String {
            self.client.clone()
        }

        pub fn stringify(&self) -> String {
            serde_json::to_string_pretty(self).unwrap()
        }
    }

    impl TryFrom<String> for WillowHeader {
        type Error = anyhow::Error;

        fn try_from(s: String) -> Result<Self, Self::Error> {
            let header: WillowHeader = serde_json::from_str(&s)?;
            Ok(header)
        }
    }

    impl TryInto<String> for WillowHeader {
        type Error = anyhow::Error;

        fn try_into(self) -> Result<String, Self::Error> {
            let header: String = serde_json::to_string_pretty(&self)?;
            Ok(header)
        }
    }

    impl std::fmt::Display for WillowHeader {
        fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
            write!(f, "{}", self.stringify())
        }
    }
}

#[allow(missing_docs)]
/// Encapsulates the WillowFooter struct & its methods
pub mod footer {
    use super::{Deserialize, Serialize};

    #[derive(Debug, Deserialize, Serialize)]
    pub struct WillowFooter {
        balance: f64,
    }

    impl WillowFooter {
        pub fn new(balance: f64) -> Self {
            WillowFooter { balance }
        }

        /// Accessors: balance
        pub fn balance(&self) -> f64 {
            self.balance
        }

        pub fn stringify(&self) -> String {
            serde_json::to_string_pretty(self).unwrap()
        }
    }
}
