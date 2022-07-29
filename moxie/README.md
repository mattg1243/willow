# Overview

`moxie` is the core statement engine for *Willow.* It utilizes *wkhtmltopdf* bindings and programmer-defined HTML templates for constructing a highly performant and flexible statement generation engine. 

# Design

### Template

`moxie` defines three *public* traits that encapsulate the interface between the programmer-defined HTML templates and the models relevant to each template. 

`Header` : encapsulates a struct that can be converted into an HTML header field

`RowCol` : encapsulates a struct that can be deconstructed into a statement row

`Footer` : encapsulates a struct that can be used to construct a statement footer

To construct additional templates besides the default ones provided, create either a new model, or, if a default template is implemented for the model already, create a meta-struct that wraps the model and implement the relevant trait on that wrapper. 

### Visibility

All structs defined in `moxie::model` are *public*, but their fields remain *private.* Accessors are provided for *only* the fields relevant to the templates. By keeping model fields private, and very rarely providing *mutators* (only in testing functions, i.e. CI helpers), we can ensure that data passed into *moxie* is immutable once it is deserialized. 

# Developing

## Library

`src/gen.rs` : defines functions for interfacing with *wkhtmltopdf* and constructing PDFs from raw HTML Strings.

`src/lib.rs` : the root library file for the `moxie` crate. defines default trait impls (HTML templates), the `full_make_html` function, tests, and mock functions for testing. 

`src/model.rs` : encapsulates the data models core to *Willow* (hence, core to *moxie* as well), their deserializers, and the three public *moxie traits.* 

## Binary

`src/moxie.rs` : the main executable file that bundles the library logic into a short binary that accepts JSON dumps at runtime, deserializes them into model objects, and performs `moxie::full_make_html` and `moxie::gen::make_gen`. 

# To Do

## Bloat

I would like to clean multiple structs in `moxie::model` from bloat. Many of the fields being passed in the JSON are irrelevant to *moxie* and are currently only being defined in order to correctly deserialize them at runtime. For example (fields denoted with *unread* indicates that *moxie* is unconcerned with them & can spawn an engine instance without ever reading them):

```rust
/// Client payload
#[derive(Debug, Deserialize, Serialize)]
pub struct Client {
  #[serde(rename = "_id")]
  // unread
  mongo_id: String,
  #[serde(rename = "ownerID")]
  // unread
  owner_id: String,
  fname: String,
  lname: String,
  phonenumber: String,
  // unread
  sessions: Vec<String>,
  balance: String,
  #[serde(rename = "__v")]
  // unread
  v: usize,
  email: String,
  rate: String,
  #[serde(rename = "isArchived")]
  // unread
  is_archived: bool,
  // unread
  id: String,
}
```

A way to fix this would be to have the *JS* construct a *meta* object before calling the *moxie* binary, that contains only fields *relevant* to the engine. This would make `src/model.rs` cleaner and prevent *moxie* from learning more about the client/events than necessary to perform its job.
