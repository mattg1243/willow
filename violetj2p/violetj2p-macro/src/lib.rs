extern crate proc_macro;
use proc_macro::TokenStream;
use quote::quote;

#[allow(unused_imports)]
use violetj2p_macro_util::J2PdfHtml;

#[proc_macro_derive(j2phtml)]
pub fn derive_j2phtml(input: TokenStream) -> TokenStream {
    // Construct a repr of Rust code as syntax tree.
    let ast = syn::parse(input).unwrap();
    // Build the trait impl.
    impl_derive_j2phtml(&ast)
}

fn impl_derive_j2phtml(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    let gen = quote! {
        impl J2PdfHtml for #name {
            fn j2phtml(&self) -> String {
                unimplemented!()
            }
        }
    };
    gen.into()
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
