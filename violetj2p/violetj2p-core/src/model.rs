#![allow(dead_code)]
#![warn(missing_docs)]

use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;

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

    /// Generate a finalized statement from a header, vector of events, and a footer
    pub fn finalize(&self, path: &str) -> Result<(), anyhow::Error> {
        let mut html = String::new();
        html.push_str(&self.header.make_header());
        for row in self.rows.iter() {
            html.push_str(&row.make_row());
        }
        html.push_str(&self.footer.make_footer());

        crate::gen::make_gen(html, path)?;
        Ok(())
    }
}

/// Defines an event
pub mod event {
    use super::{Deserialize, JsonValue, RowCol, Serialize};

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

    /// This is where we define the HTML schema for the rowcol objects
    /// i.e. the events
    impl RowCol for Event {
        fn make_row(&self) -> String {
            let mut html = String::new();
            html.push_str(&format!(
                "<div class=\"rowcol\">
                        <div class=\"header\">
                            <div class=\"owner\">{}</div>
                            <div class=\"client\">{}</div>
                            <div class=\"date\">{}</div>
                            <div class=\"type\">{}</div>
                        </div>
                        <div class=\"body\">
                            <div class=\"duration\">{}</div>
                            <div class=\"rate\">{}</div>
                            <div class=\"amount\">{}</div>
                            <div class=\"new-balance\">{}</div>
                        </div>
                    </div>",
                self.owner_id(),
                self.client_id(),
                self.date(),
                self.event_type(),
                self.duration(),
                self.rate(),
                self.amount(),
                self.new_balance()
            ));

            html
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

    impl TryInto<String> for Event {
        type Error = anyhow::Error;

        fn try_into(self) -> Result<String, Self::Error> {
            let s = serde_json::to_string_pretty(&self)?;
            Ok(s)
        }
    }
}

#[allow(missing_docs)]
pub mod header {
    use super::{Deserialize, Header, Serialize};

    #[derive(Debug, Deserialize, Serialize)]
    pub struct WillowHeader {
        provider: String,
        contact: String,
        billing: String,
        client: String,
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
pub mod footer {
    use super::{Deserialize, Footer, Serialize};

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

    impl Footer for WillowFooter {
        fn make_footer(&self) -> String {
            let mut html = String::new();
            html.push_str(&format!(
                "<div class=\"footer\">
                        <div class=\"balance\">{}</div>
                    </div>",
                self.balance()
            ));
            html
        }
    }
}

#[cfg(test)]
mod model_test_core {
    use super::{event::Event, footer::WillowFooter, header::WillowHeader, HtmlStatement};
    #[allow(unused_imports)]
    use super::{Footer, Header, RowCol};

} 
