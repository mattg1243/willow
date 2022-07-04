extern crate proc_macro;
use proc_macro::TokenStream;
use syn::{parse, token::Token};

#[proc_macro_attribute]
pub fn streams(attr: TokenStream, item: TokenStream) -> TokenStream {
    println!("attr: {}", attr);
    println!("item: {}", item);
    item
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
