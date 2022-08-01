#![allow(dead_code)]
#![warn(missing_docs)]

use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;

/// Client payload
#[derive(Debug, Deserialize, Serialize)]
pub struct Client {
    fname: String,
    lname: String,
    phonenumber: String,
    balance: JsonValue,
    email: String,
    rate: JsonValue,
}

impl TryFrom<String> for Client {
    type Error = Box<dyn std::error::Error>;

    fn try_from(value: String) -> Result<Client, Self::Error> {
        let c: Client = serde_json::from_str(value.as_str())?;
        Ok(c)
    }
}

#[allow(missing_docs)]
impl Client {
    /// Mock for tests/benches
    pub fn mock() -> Client {
        Client {
            fname: "Winona".to_string(),
            lname: "Ryder".to_string(),
            phonenumber: "925-678-9876".to_string(),
            balance: JsonValue::String("987.24".to_string()),
            email: "winona@skiff.com".to_string(),
            rate: JsonValue::String("90".to_string()),
        }
    }

    pub fn concat_prov(&self) -> String {
        let mut cat = String::new();
        cat.push_str(self.fname.as_str());
        cat.push_str(" ");
        cat.push_str(self.lname.as_str());
        return cat;
    }
    pub fn balance(&self) -> JsonValue {
        self.balance.clone()
    }
    pub fn email(&self) -> String {
        self.email.clone()
    }
    pub fn rate(&self) -> JsonValue {
        self.rate.clone()
    }
}

/// User Payload
#[derive(Debug, Deserialize, Serialize)]
#[allow(missing_docs)]
pub struct User {
    pub fname: String,
    pub lname: String,
    pub email: String,
    city: String,
    #[serde(rename = "nameForHeader")]
    pub name_on_header: String,
    pub phone: String,
    pub state: String,
    pub street: String,
    pub zip: String,
    #[serde(rename = "paymentInfo")]
    pub payments: JsonValue,
    license: String,
}

impl TryFrom<String> for User {
    type Error = anyhow::Error;

    fn try_from(value: String) -> Result<User, Self::Error> {
        Ok(serde_json::from_str(value.as_str())?)
    }
}

#[allow(missing_docs)]
impl User {
    /// Mock for test/benches
    pub fn mock() -> User {
        User {
            fname: "Moxie".to_string(),
            lname: "Ryder".to_string(),
            email: "moxie@skiff.com".to_string(),
            city: "Anchorage".to_string(),
            name_on_header: "Moxie Ryder".to_string(),
            phone: "899-777-1928".to_string(),
            state: "Alaska".to_string(),
            street: "Anchorage dr.".to_string(),
            zip: "67826".to_string(),
            payments: serde_json::json!({"eth": "moxieryder.eth"}),
            license: "GOAT".to_string(),
        }
    }

    pub fn catname(&self) -> String {
        format!("{} {}", self.fname.clone(), self.lname.clone())
    }
    pub fn billing_addr(&self) -> JsonValue {
        serde_json::json!({
            "street": self.street.clone(),
            "city": self.city.clone(),
            "state": self.state.clone(),
            "zip": self.zip.clone(),
        })
    }
    pub fn nameoh(&self) -> String {
        self.name_on_header.clone()
    }
    pub fn payments(&self) -> JsonValue {
        self.payments.clone()
    }
    pub fn phone(&self) -> String {
        self.phone.clone()
    }
    pub fn license(&self) -> String {
        self.license.clone()
    }
}

/// Defines an event schema & its methods
pub mod event {
    use super::{Deserialize, JsonValue, Serialize};

    /// The schema for the willow::Event record.
    #[derive(Debug, Deserialize, Serialize)]
    #[allow(missing_docs)]
    pub struct Event {
        date: String,
        #[serde(rename = "type")]
        event_type: String,
        duration: f32,
        rate: Option<u32>,
        amount: JsonValue,
        #[serde(rename = "newBalance")]
        new_balance: String,
        #[serde(rename = "__v")]
        v: usize,
        detail: String,
    }

    #[allow(missing_docs, dead_code)]
    impl Event {
        /// Constructor for testing
        pub fn new(
            date: &str,
            etype: &str,
            duration: f32,
            rate: Option<u32>,
            amount: JsonValue,
            new_balance: &str,
            v: usize,
            detail: &str,
        ) -> Self {
            Self {
                date: date.to_owned(),
                event_type: etype.to_owned(),
                duration,
                rate,
                amount,
                new_balance: new_balance.to_owned(),
                v,
                detail: detail.to_owned(),
            }
        }

        /// Deserialize a JSON array of Events into a vector
        pub fn collect(json_dump: String) -> Result<Vec<Self>, anyhow::Error> {
            return Ok(serde_json::from_str(json_dump.as_str())?);
        }

        /// Mock a vector of Event for testing
        pub fn mock_deps() -> Vec<Self> {
            let mut mock: Vec<Self> = vec![];
            for _ in 0..10 {
                mock.push(Self::new(
                    "07/22/2022",
                    "Meeting",
                    2f32,
                    Some(90u32),
                    serde_json::json!("amount: {200}"),
                    "200.50",
                    0,
                    "undefined",
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
        pub fn rate(&self) -> Option<u32> {
            self.rate
        }
        /// If 'rate' is null, returns an empty string.
        /// If rate is non-null, returns u32
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
}

#[allow(missing_docs)]
/// Defines the WillowHeader struct & its methods
pub mod header {
    use super::{Client, Deserialize, Serialize, User};

    #[derive(Debug, Deserialize, Serialize)]
    pub struct WillowHeader {
        pub provider: String,
        pub contact: String,
        pub billing: super::JsonValue,
        pub client: String,
    }

    impl TryFrom<(Client, User)> for WillowHeader {
        type Error = anyhow::Error;

        fn try_from(value: (Client, User)) -> Result<WillowHeader, Self::Error> {
            Ok(WillowHeader {
                provider: value.0.concat_prov(),
                contact: value.0.email(),
                billing: value.1.billing_addr(),
                client: value.1.catname(),
            })
        }
    }

    impl WillowHeader {
        pub fn new(
            provider: String,
            contact: String,
            billing: super::JsonValue,
            client: String,
        ) -> Self {
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

        pub fn billing(&self) -> super::JsonValue {
            self.billing.clone()
        }

        pub fn client(&self) -> String {
            self.client.clone()
        }

        pub fn stringify(&self) -> String {
            serde_json::to_string_pretty(self).unwrap()
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

#[cfg(test)]
mod impl_tests {
    use super::*;
    use header::WillowHeader;

    #[test]
    fn client_user_to_header() {
        pretty_env_logger::try_init().ok();

        let c = Client::mock();
        let u = User::mock();
        let h: WillowHeader = WillowHeader::try_from((c, u)).unwrap();

        log::info!("Constructed 'WillowHeader' from (Client, User): {:?}", h)
    }
}
