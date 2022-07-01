use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;

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

