/// Defines the behavior of our macro.
#[allow(non_camel_case_types)]
pub trait J2RowCol {
    /// The model::Event struct derives an implementation of this trait
    /// that defines the mapping of Self's (i.e. a model::Event object) fields
    /// to the fields of the resulting HTML rowcol schema.
    fn j2phtml(&self) -> String;
}

pub trait J2Footer {
    fn j2phtml(&self) -> String;
}

pub trait J2Header {
    fn j2phtml(&self) -> String;
}
