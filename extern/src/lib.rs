use pyo3::prelude::*;
use serde::*;
use serde_json::Value as JsonValue;

#[pyclass]
#[derive(Debug, Deserialize, Serialize)]
struct ClientInfo {
    clientname: String,
    #[serde(rename = "billingAdd")]
    billing_add: String,
    #[serde(rename = "mailingAdd")]
    mailing_add: String,
    phone: String,
}

#[pymethods]
impl ClientInfo {
    #[new]
    pub fn new() -> ClientInfo {
        let args: Vec<String> = std::env::args().collect();
        let c_info_string: String = args[1].clone();
        let c_info_obj: ClientInfo = serde_json::from_str(&c_info_string).unwrap();
        c_info_obj
    }
}

#[pyclass]
#[derive(Debug, Serialize, Deserialize)]
struct ProviderInfo {
    name: String,
    address: JsonValue,
    phone: String,
    email: String,
    payment_info: String,
}

#[pymethods]
impl ProviderInfo {
    #[new]
    pub fn new() -> ProviderInfo {
        let args: Vec<String> = std::env::args().collect();
        let p_info_string: String = args[3].clone();
        let p_info_obj: ProviderInfo = serde_json::from_str(&p_info_string).unwrap();
        p_info_obj
    }
}

#[pyclass]
#[derive(Debug, Deserialize, Serialize)]
struct Event {
    #[serde(rename = "ownerID")]
    owner_id: String,
    #[serde(rename = "clientID")]
    client_id: String,
    date: String,
    #[serde(rename = "type")]
    e_type: String,
    detail: Option<String>,
    duration: Option<u8>,
    rate: Option<u32>,
    amount: JsonValue,
    #[serde(rename = "newBalance")]
    new_balance: JsonValue,
}

#[pymethods]
impl Event {
    #[new]
    pub fn new() -> Event {
        let args: Vec<String> = std::env::args().collect();
        let e_info_string: String = args[2].clone();
        let e_obj: Event = serde_json::from_str(&e_info_string).unwrap();
        e_obj
    }
}

#[pymodule]
fn willow_parser(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_class::<ClientInfo>().unwrap();
    m.add_class::<ProviderInfo>().unwrap();
    m.add_class::<Event>()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn c_info_parse() {
        let data = r#"
        {
          "clientname": "ethan",
          "billingAdd": "128 akjala",
          "mailingAdd": "12834 alkdj",
          "phone": "12834"
        }
        "#;

        let c_info: ClientInfo = serde_json::from_str(&data).unwrap();
        println!("{:?}", c_info)
    }

    #[test]
    fn p_info_parse() {
        let data = r#"
      {
        "name": "ethan",
        "address": {
          "street": "donkey rd",
          "cityState": "martienx, ca"
        },
        "phone": "925-456-8090",
        "email": "ethan@lmao",
        "payment_info": "lmao pay me"
      }"#;

        let p_info: ProviderInfo = serde_json::from_str(&data).unwrap();
        println!("{:?}", p_info)
    }

    #[test]
    fn evt_parse() {
        let data = r#"
      {
        "ownerID": "1283489898989",
        "clientID": "2408720480248",
        "date": "12/23/45",
        "type": "Phone call",
        "duration": 2,
        "rate": 190,
        "amount": {
          "$numberDecimal": "-380"
        },
        "newBalance": {
          "$numberDecimal": "-380"
        }
      }"#;

        let event: Event = serde_json::from_str(&data).unwrap();
        println!("{:?}", event)
    }

    #[test]
    fn full_willow_parse() {
        pretty_env_logger::init();

        // ClientInfo Deserialize
        let data = r#"
        {
          "clientname": "ethan",
          "billingAdd": "128 akjala",
          "mailingAdd": "12834 alkdj",
          "phone": "12834"
        }
        "#;

        let c_info: ClientInfo = serde_json::from_str(&data).unwrap();
        log::debug!("{:?}", c_info);

        // Provider Info Deserialize
        let data = r#"
      {
        "name": "ethan",
        "address": {
          "street": "donkey rd",
          "cityState": "martienx, ca"
        },
        "phone": "925-456-8090",
        "email": "ethan@lmao",
        "payment_info": "lmao pay me"
      }"#;

        let p_info: ProviderInfo = serde_json::from_str(&data).unwrap();
        log::debug!("{:?}", p_info);

        // Event Deserialized
        let data = r#"
      {
        "ownerID": "1283489898989",
        "clientID": "2408720480248",
        "date": "12/23/45",
        "type": "Phone call",
        "duration": 2,
        "rate": 190,
        "amount": {
          "$numberDecimal": "-380"
        },
        "newBalance": {
          "$numberDecimal": "-380"
        }
      }"#;

        let event: Event = serde_json::from_str(&data).unwrap();
        log::debug!("{:?}", event)
    }
}
